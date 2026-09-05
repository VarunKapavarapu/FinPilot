import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  Transaction,
  AuditLogEntry,
  ControllerMetrics,
  TaxLineRecord,
  RazorpaySettlementBatch,
  AIModelSettings,
  AIModelType
} from '../types/finance';
import {
  generateFull250Transactions,
  INITIAL_AUDIT_LOGS,
  MOCK_TAX_LINES,
  MOCK_RAZORPAY_SETTLEMENTS
} from '../data/mockFinancialData';

interface FinanceContextType {
  transactions: Transaction[];
  auditLogs: AuditLogEntry[];
  taxLines: TaxLineRecord[];
  settlementBatches: RazorpaySettlementBatch[];
  metrics: ControllerMetrics;
  selectedTransaction: Transaction | null;
  setSelectedTransaction: (txn: Transaction | null) => void;
  investigatingTransaction: Transaction | null;
  setInvestigatingTransaction: (txn: Transaction | null) => void;
  approveTransaction: (id: string, note?: string) => void;
  rejectTransaction: (id: string, note?: string) => void;
  markAsException: (id: string, reason?: string) => void;
  resetToDemoData: () => void;
  importCustomTransactions: (imported: Transaction[]) => void;
  filterStatus: string;
  setFilterStatus: (s: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  notification: string | null;
  setNotification: (n: string | null) => void;
  aiSettings: AIModelSettings;
  setAISettings: React.Dispatch<React.SetStateAction<AIModelSettings>>;
  isRunTheBooksOpen: boolean;
  setIsRunTheBooksOpen: (open: boolean) => void;
  executeRunTheBooksLoop: () => Promise<void>;
  isLoopRunning: boolean;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => generateFull250Transactions());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => INITIAL_AUDIT_LOGS);
  const [taxLines, setTaxLines] = useState<TaxLineRecord[]>(() => MOCK_TAX_LINES);
  const [settlementBatches, setSettlementBatches] = useState<RazorpaySettlementBatch[]>(() => MOCK_RAZORPAY_SETTLEMENTS);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [investigatingTransaction, setInvestigatingTransaction] = useState<Transaction | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentView, setCurrentView] = useState<string>('landing');
  const [notification, setNotification] = useState<string | null>(null);
  const [isRunTheBooksOpen, setIsRunTheBooksOpen] = useState<boolean>(false);
  const [isLoopRunning, setIsLoopRunning] = useState<boolean>(false);

  const [aiSettings, setAISettings] = useState<AIModelSettings>({
    selectedModel: 'Razorpay-Ops LLM (Fine-tuned Fintech)',
    verificationThreshold: 95,
    taxMatcherEnabled: true,
    settlementQAEnabled: true,
    autonomousMode: true,
  });

  // Dynamically compute metrics directly from the transaction dataset
  const metrics = useMemo<ControllerMetrics>(() => {
    const total = transactions.length;
    if (total === 0) {
      return {
        recordsProcessed: 0,
        matchedCount: 0,
        matchRate: 0,
        exceptionsCount: 0,
        discrepancyTotal: 0,
        cashPosition: 1840000,
        precisionRate: 94.1,
        recallRate: 91.7,
        falseMatches: 3,
        avgProcessingTimeSec: 1.8,
        throughputTxnPerSec: 138,
      };
    }

    const matched = transactions.filter(
      t => t.status === 'MATCHED' || t.resolution === 'HUMAN_APPROVED'
    ).length;

    const exceptions = transactions.filter(
      t => t.status !== 'MATCHED' && t.resolution !== 'HUMAN_APPROVED'
    );

    const discrepancySum = exceptions.reduce((sum, t) => sum + (t.discrepancyAmount || 0), 0);
    const matchRate = +( (matched / total) * 100 ).toFixed(1);

    return {
      recordsProcessed: total,
      matchedCount: matched,
      matchRate,
      exceptionsCount: exceptions.length,
      discrepancyTotal: discrepancySum,
      cashPosition: 1840000,
      precisionRate: 94.1,
      recallRate: 91.7,
      falseMatches: 3,
      avgProcessingTimeSec: 1.8,
      throughputTxnPerSec: 138,
    };
  }, [transactions]);

  const approveTransaction = useCallback((id: string, note?: string) => {
    const timeNow = new Date().toLocaleTimeString('en-US', { hour12: false });
    
    setTransactions(prev =>
      prev.map(t => {
        if (t.id === id) {
          return {
            ...t,
            status: 'MATCHED' as const,
            resolution: 'HUMAN_APPROVED' as const,
            discrepancyAmount: 0,
            confidence: 100,
            resolvedAt: `${new Date().toISOString().split('T')[0]} ${timeNow}`,
            aiExplanation: note || `Approved by Finance Controller. Ledger adjusted and reconciled manually.`,
          };
        }
        return t;
      })
    );

    const newLog: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: timeNow,
      actor: 'Human Controller',
      action: `Approved exception ${id}`,
      recordId: id,
      detail: note || `Human operator verified and approved transaction. Ledgers in balance.`,
      category: 'HUMAN_ACTION',
    };

    setAuditLogs(prev => [newLog, ...prev]);
    setNotification(`Transaction ${id} approved and reconciled.`);
  }, []);

  const rejectTransaction = useCallback((id: string, reason?: string) => {
    const timeNow = new Date().toLocaleTimeString('en-US', { hour12: false });

    setTransactions(prev =>
      prev.map(t => {
        if (t.id === id) {
          return {
            ...t,
            resolution: 'HUMAN_REJECTED' as const,
            aiExplanation: reason || `Rejected by Finance Controller. Escalated to vendor audit.`,
          };
        }
        return t;
      })
    );

    const newLog: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: timeNow,
      actor: 'Human Controller',
      action: `Rejected transaction ${id}`,
      recordId: id,
      detail: reason || `Manual rejection. Disputed with payment processor.`,
      category: 'HUMAN_ACTION',
    };

    setAuditLogs(prev => [newLog, ...prev]);
    setNotification(`Transaction ${id} rejected & flagged for vendor audit.`);
  }, []);

  const markAsException = useCallback((id: string, reason?: string) => {
    const timeNow = new Date().toLocaleTimeString('en-US', { hour12: false });

    setTransactions(prev =>
      prev.map(t => {
        if (t.id === id) {
          return {
            ...t,
            status: 'REVIEW REQUIRED' as const,
            resolution: 'PENDING_REVIEW' as const,
            aiExplanation: reason || 'Marked for human review by operator.',
          };
        }
        return t;
      })
    );

    const newLog: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: timeNow,
      actor: 'Human Controller',
      action: `Flagged exception ${id}`,
      recordId: id,
      detail: reason || `Sent to exception queue for manual forensic review.`,
      category: 'EXCEPTION_FLAG',
    };

    setAuditLogs(prev => [newLog, ...prev]);
    setNotification(`Transaction ${id} flagged as exception.`);
  }, []);

  const resetToDemoData = useCallback(() => {
    setTransactions(generateFull250Transactions());
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setTaxLines(MOCK_TAX_LINES);
    setSettlementBatches(MOCK_RAZORPAY_SETTLEMENTS);
    setSelectedTransaction(null);
    setInvestigatingTransaction(null);
    setNotification('Demo dataset reloaded: 250 records, 18 exceptions initialized.');
  }, []);

  const importCustomTransactions = useCallback((imported: Transaction[]) => {
    setTransactions(imported);
    const timeNow = new Date().toLocaleTimeString('en-US', { hour12: false });
    const newLog: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: timeNow,
      actor: 'System Engine',
      action: `Imported ${imported.length} financial records`,
      detail: `Batch dataset ingestion completed. Automatic reconciliation pipeline executed.`,
      category: 'SYSTEM_EVENT',
    };
    setAuditLogs(prev => [newLog, ...prev]);
    setNotification(`Successfully imported ${imported.length} transactions.`);
  }, []);

  const executeRunTheBooksLoop = useCallback(async () => {
    setIsLoopRunning(true);
    setIsRunTheBooksOpen(true);
  }, []);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        auditLogs,
        taxLines,
        settlementBatches,
        metrics,
        selectedTransaction,
        setSelectedTransaction,
        investigatingTransaction,
        setInvestigatingTransaction,
        approveTransaction,
        rejectTransaction,
        markAsException,
        resetToDemoData,
        importCustomTransactions,
        filterStatus,
        setFilterStatus,
        searchQuery,
        setSearchQuery,
        currentView,
        setCurrentView,
        notification,
        setNotification,
        aiSettings,
        setAISettings,
        isRunTheBooksOpen,
        setIsRunTheBooksOpen,
        executeRunTheBooksLoop,
        isLoopRunning,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

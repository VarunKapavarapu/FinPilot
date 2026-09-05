export type TransactionStatus =
  | 'MATCHED'
  | 'PARTIAL MATCH'
  | 'DUPLICATE'
  | 'MISSING'
  | 'AMOUNT MISMATCH'
  | 'REVIEW REQUIRED';

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ResolutionStatus = 'AI_AUTO' | 'HUMAN_APPROVED' | 'HUMAN_REJECTED' | 'PENDING_REVIEW';

export interface MatchEvidence {
  customerMatched: boolean;
  referenceMatched: boolean;
  dateWithinWindow: boolean;
  amountMatched: boolean;
  taxAdjusted?: boolean;
  notes: string;
}

export interface Transaction {
  id: string;
  date: string;
  time: string;
  source: 'HDFC Bank' | 'ICICI Bank' | 'Stripe' | 'Razorpay' | 'Bank Wire' | 'RazorpayX' | 'Smart Collect';
  invoiceId?: string;
  customerName: string;
  amount: number;
  expectedAmount?: number;
  confidence: number;
  status: TransactionStatus;
  severity?: SeverityLevel;
  discrepancyAmount?: number;
  aiExplanation: string;
  evidence: MatchEvidence;
  resolution: ResolutionStatus;
  resolvedAt?: string;
  tags?: string[];
  duplicateOfId?: string;
  taxSection?: string;
  razorpayPayoutId?: string;
}

export interface TaxLineRecord {
  id: string;
  invoiceId: string;
  vendor: string;
  taxSection: '194J (10% Tech)' | '194C (2% Contractor)' | '194H (5% Commission)' | '194Q (0.1% Goods)' | 'GST-TDS (2%)';
  grossBilled: number;
  expectedTds: number;
  actualDeducted: number;
  netDisbursed: number;
  variance: number;
  challanRef?: string;
  status: 'MATCHED' | 'DISCREPANCY' | 'MISSING_26AS';
  aiRecommendation: string;
}

export interface RazorpaySettlementBatch {
  batchId: string;
  date: string;
  payoutType: 'Instant Payout' | 'Standard T+1' | 'Smart Collect' | 'Razorpay Route (Splits)';
  grossCollection: number;
  mdrFee: number;
  gst18: number;
  netCreditedToBank: number;
  actualBankCredit: number;
  delta: number;
  status: 'RECONCILED' | 'FEE_VARIANCE' | 'RESERVE_HOLD';
  notes: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  status: 'PAID' | 'PARTIALLY_PAID' | 'OUTSTANDING' | 'OVERDUE';
}

export interface Settlement {
  id: string;
  gateway: 'Stripe' | 'Razorpay' | 'HDFC Direct' | 'Wire Settlement' | 'RazorpayX';
  grossAmount: number;
  fees: number;
  netAmount: number;
  settlementDate: string;
  status: 'SETTLED' | 'PENDING' | 'FAILED';
  payoutRef: string;
}

export interface CashForecastPoint {
  date: string;
  dayLabel: string;
  actualCash?: number;
  projectedCash: number;
  expectedInflow: number;
  expectedOutflow: number;
  confidenceLower: number;
  confidenceUpper: number;
}

export type AuditCategory = 'AI_ACTION' | 'HUMAN_ACTION' | 'SYSTEM_EVENT' | 'EXCEPTION_FLAG';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: 'AI Controller' | 'Human Controller' | 'System Engine' | 'Reconciliation Worker' | 'Razorpay Settlement Agent';
  action: string;
  recordId?: string;
  detail: string;
  category: AuditCategory;
  confidence?: number;
}

export interface ControllerMetrics {
  recordsProcessed: number;
  matchedCount: number;
  matchRate: number; // percentage, e.g. 92.8
  exceptionsCount: number;
  discrepancyTotal: number; // e.g. 237000
  cashPosition: number; // e.g. 1840000
  precisionRate: number; // e.g. 94.1
  recallRate: number; // e.g. 91.7
  falseMatches: number; // e.g. 3
  avgProcessingTimeSec: number; // e.g. 1.8
  throughputTxnPerSec: number; // e.g. 138 txns/sec
}

export interface AIToolStep {
  id: string;
  toolName: string;
  status: 'idle' | 'running' | 'completed' | 'warning';
  message: string;
  durationMs: number;
}

export type AIModelType =
  | 'Razorpay-Ops LLM (Fine-tuned Fintech)'
  | 'Gemini 1.5 Pro (Financial Reasoning)'
  | 'FinPilot Neural Matcher v3'
  | 'Claude 3.5 Sonnet';

export interface AIModelSettings {
  selectedModel: AIModelType;
  verificationThreshold: number; // 90, 95, 98
  taxMatcherEnabled: boolean;
  settlementQAEnabled: boolean;
  autonomousMode: boolean;
}

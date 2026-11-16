//------------------------------------------------------
// Thin wrapper around common Xero accounting queries (xero-node, OAuth 2.0)
// Web Link=> https://github.com/XeroAPI/xero-node
//------------------------------------------------------

// Xero filter syntax: Date >= DateTime(2015, 12, 01)
const toXeroDateTime = (date) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) throw new TypeError(`Invalid date: ${date}`);
  const pad = (n) => String(n).padStart(2, '0');
  return `DateTime(${d.getUTCFullYear()}, ${pad(d.getUTCMonth() + 1)}, ${pad(d.getUTCDate())})`;
};

const dateRangeFilter = (startDate, endDate) =>
  [
    startDate && `Date >= ${toXeroDateTime(startDate)}`,
    endDate && `Date < ${toXeroDateTime(endDate)}`,
  ]
    .filter(Boolean)
    .join(' && ') || undefined;

export class XeroService {
  /** @param {import('xero-node').XeroClient} xero an authenticated client */
  constructor(xero, tenantId) {
    this.xero = xero;
    this.tenantId = tenantId;
  }

  async getActiveAccounts() {
    const { body } = await this.xero.accountingApi.getAccounts(
      this.tenantId,
      undefined,
      'Status=="ACTIVE"',
    );
    return body.accounts;
  }

  async getPayments(startDate, endDate) {
    const { body } = await this.xero.accountingApi.getPayments(
      this.tenantId,
      undefined,
      dateRangeFilter(startDate, endDate),
    );
    return body.payments;
  }

  async getInvoices(startDate, endDate) {
    const { body } = await this.xero.accountingApi.getInvoices(
      this.tenantId,
      undefined,
      dateRangeFilter(startDate, endDate),
    );
    return body.invoices;
  }

  async getBalanceSheet(date) {
    const day = new Date(date).toISOString().slice(0, 10);
    const { body } = await this.xero.accountingApi.getReportBalanceSheet(this.tenantId, day);
    return body.reports;
  }

  // Payroll (Australia); other regions use payrollUKApi / payrollNZApi
  async getPayRuns() {
    const { body } = await this.xero.payrollAUApi.getPayRuns(this.tenantId);
    return body.payRuns;
  }
}

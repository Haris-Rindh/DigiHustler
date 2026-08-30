import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Check, AlertCircle, ArrowRight, Download, RefreshCw, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User, UserRoleTier, GroupId } from '../../types';

interface BulkImportModalProps {
  onClose: () => void;
  onSuccess?: (count: number) => void;
}

interface ParsedRow {
  name: string;
  email: string;
  role: string;
  squad: string;
  title: string;
  hourlyRate?: number;
  joinYear?: number;
  isValid: boolean;
  error?: string;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({ onClose, onSuccess }) => {
  const { bulkImportMembers, users } = useApp();
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview'>('upload');
  const [rawText, setRawText] = useState('');
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [mapping, setMapping] = useState({
    nameCol: 'Name',
    emailCol: 'Email',
    roleCol: 'Role',
    squadCol: 'Squad',
    titleCol: 'Title',
    rateCol: 'Rate',
  });

  const sampleCsv = `Name,Email,Role,Squad,Title,Rate
Kashif Mehmood,kashif.m@digihust.com,freelancer,tech,Full Stack React Engineer,30
Hina Shah,hina.s@digihust.com,freelancer,creative,Senior 3D Motion Designer,35
Omer Tariq,omer.t@digihust.com,freelancer,data,BI & Python Automation Specialist,32
Zainab Bibi,zainab.b@digihust.com,freelancer,growth,Technical SEO & Funnel Closer,28`;

  const handleDownloadTemplate = () => {
    const blob = new Blob([sampleCsv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'DigiHust_Member_Import_Template.csv';
    a.click();
  };

  const handleParseData = (content: string) => {
    const lines = content.trim().split('\n').filter(l => l.trim().length > 0);
    if (lines.length <= 1) {
      alert('The provided file has no data rows.');
      return;
    }

    const rows: ParsedRow[] = [];
    const existingEmails = new Set(users.map(u => u.email.toLowerCase()));

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
      const name = cols[0] || '';
      const email = cols[1] || '';
      const role = cols[2] || 'freelancer';
      const squad = cols[3] || 'tech';
      const title = cols[4] || 'Domain Specialist';
      const rate = Number(cols[5]) || 25;

      let isValid = true;
      let error = '';

      if (!name) {
        isValid = false;
        error = 'Missing full name';
      } else if (!email || !email.includes('@')) {
        isValid = false;
        error = 'Invalid email format';
      } else if (existingEmails.has(email.toLowerCase())) {
        isValid = false;
        error = 'Email already exists in system';
      }

      rows.push({
        name,
        email,
        role,
        squad,
        title,
        hourlyRate: rate,
        joinYear: 2026,
        isValid,
        error
      });
    }

    setParsedRows(rows);
    setStep('preview');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setRawText(text);
      handleParseData(text);
    };
    reader.readAsText(file);
  };

  const handleCommitImport = () => {
    const validRows = parsedRows.filter(r => r.isValid);
    if (validRows.length === 0) return;

    const toImport: Partial<User>[] = validRows.map(r => ({
      name: r.name,
      email: r.email,
      role: (r.role === 'group_leader' ? 'group_leader' : (r.role === 'intern' ? 'intern' : (r.role === 'management' ? 'management' : 'freelancer'))),
      roleTier: (r.role === 'group_leader' ? 'group_leader' : (r.role === 'intern' ? 'intern' : (r.role === 'management' ? 'manager' : 'member'))) as UserRoleTier,
      groupId: (r.squad as GroupId) || 'tech',
      title: r.title,
      hourlyRate: r.hourlyRate || 25,
      joinYear: 2026
    }));

    const result = bulkImportMembers(toImport);
    if (onSuccess) onSuccess(result.count);
    onClose();
  };

  const validCount = parsedRows.filter(r => r.isValid).length;
  const invalidCount = parsedRows.filter(r => !r.isValid).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col justify-between">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <FileSpreadsheet className="w-5 h-5 text-[var(--brand-teal)]" />
              <h3 className="font-display font-extrabold text-xl text-[var(--text-heading)]">
                Bulk Import Members from Excel / CSV
              </h3>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-heading)]">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-[var(--text-body)] mb-6">
            Upload your staff roster to generate sequential <span className="font-mono text-[var(--brand-teal)] font-bold">DGH</span> IDs automatically. Credentials will remain pending until you trigger batch dispatch.
          </p>
        </div>

        {/* Step 1: Upload or Paste */}
        {step === 'upload' && (
          <div className="space-y-4 my-auto py-4">
            <div className="border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--brand-teal)] rounded-3xl p-8 text-center transition-all bg-[var(--bg-page)]">
              <Upload className="w-10 h-10 text-[var(--brand-teal)] mx-auto mb-3 opacity-80" />
              <p className="text-xs font-bold text-[var(--text-heading)] mb-1">
                Upload CSV or Excel file (.csv, .xlsx)
              </p>
              <p className="text-[11px] text-[var(--text-muted)] mb-4">
                Drag and drop your spreadsheet or click to browse
              </p>
              <input
                type="file"
                accept=".csv, .txt, .xlsx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload-input"
              />
              <label
                htmlFor="file-upload-input"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                <span>Select File</span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleDownloadTemplate}
                className="text-xs text-[var(--brand-teal)] hover:underline font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample CSV Template</span>
              </button>
              <button
                onClick={() => {
                  setRawText(sampleCsv);
                  handleParseData(sampleCsv);
                }}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-heading)] font-semibold cursor-pointer"
              >
                Use Demo Sample Data →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Validation Preview */}
        {step === 'preview' && (
          <div className="space-y-4 my-auto py-2 flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-xs">
              <div className="flex items-center space-x-4">
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> {validCount} Rows Ready
                </span>
                {invalidCount > 0 && (
                  <span className="font-bold text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {invalidCount} Rows with Errors
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[var(--text-muted)]">Automatic DGH Sequence</span>
            </div>

            <div className="flex-1 overflow-y-auto max-h-60 space-y-1.5 border border-[var(--border-subtle)] rounded-2xl p-2 bg-[var(--bg-page)]">
              {parsedRows.map((row, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl text-xs border flex items-center justify-between ${
                    row.isValid
                      ? 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-heading)]'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">#{i + 1}</span>
                    <span className="font-bold">{row.name}</span>
                    <span className="text-[11px] text-[var(--text-muted)] truncate">{row.email}</span>
                    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-muted)]">{row.squad}</span>
                  </div>
                  <div>
                    {row.isValid ? (
                      <span className="text-[10px] font-bold text-emerald-400">Valid</span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-400">{row.error}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)] mt-4">
          {step === 'preview' ? (
            <button
              onClick={() => setStep('upload')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] cursor-pointer"
            >
              ← Back to Upload
            </button>
          ) : <div />}

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] cursor-pointer"
            >
              Cancel
            </button>
            {step === 'preview' && (
              <button
                onClick={handleCommitImport}
                disabled={validCount === 0}
                className="px-6 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                Import {validCount} Members
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

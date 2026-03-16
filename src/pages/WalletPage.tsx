import React, { useState } from 'react';
import { Wallet, Plus, ArrowDownLeft, ArrowUpRight, CreditCard, QrCode, TrendingUp, ShieldCheck } from 'lucide-react';

const TRANSACTIONS = [
  { id: 1, type: 'credit', desc: 'Deposito via PIX', value: 500, date: '15/03/2026', status: 'Concluido' },
  { id: 2, type: 'debit', desc: 'Consulta agendada', value: -350, date: '14/03/2026', status: 'Escrow' },
  { id: 3, type: 'credit', desc: 'Reembolso de consulta cancelada', value: 120, date: '10/03/2026', status: 'Concluido' },
  { id: 4, type: 'debit', desc: 'Consulta concluida', value: -400, date: '05/03/2026', status: 'Concluido' },
];

export const WalletPage: React.FC = () => {
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositValue, setDepositValue] = useState('');
  const [depositMethod, setDepositMethod] = useState('pix');
  const [balance, setBalance] = useState(750);
  const [escrow, setEscrow] = useState(350);
  const [success, setSuccess] = useState(false);

  const handleDeposit = () => {
    const value = Number(depositValue);
    if (value > 0) {
      setBalance((current) => current + value);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setShowDeposit(false);
        setDepositValue('');
      }, 2000);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Minha Carteira</h1>
        <p className="text-slate-500">Gerencie seu saldo e pagamentos com seguranca</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6 bg-primary text-white col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <Wallet size={20} />
            <span className="text-sm font-medium opacity-80">Saldo disponivel</span>
          </div>
          <div className="text-3xl font-bold mb-1">R$ {balance.toFixed(2).replace('.', ',')}</div>
          <div className="text-xs opacity-70">Disponivel para consultas</div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-3 text-yellow-600">
            <ShieldCheck size={20} />
            <span className="text-sm font-medium">Em Escrow</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">R$ {escrow.toFixed(2).replace('.', ',')}</div>
          <div className="text-xs text-slate-500">Retido ate consulta</div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-3 text-green-600">
            <TrendingUp size={20} />
            <span className="text-sm font-medium">Economia total</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">R$ 420,00</div>
          <div className="text-xs text-slate-500">Com o plano Plus</div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => setShowDeposit(!showDeposit)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Adicionar saldo
        </button>
        <button className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-all flex items-center gap-2">
          <ArrowUpRight size={18} /> Solicitar reembolso
        </button>
      </div>

      {showDeposit && (
        <div className="card p-6 border-2 border-primary/20 space-y-4">
          <h3 className="font-bold text-slate-900 text-lg">Adicionar saldo</h3>

          {success && (
            <div className="p-4 bg-green-50 text-green-700 rounded-xl font-medium flex items-center gap-2">
              <ShieldCheck size={18} /> Saldo adicionado com sucesso!
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Valor</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">R$</span>
              <input
                type="number"
                value={depositValue}
                onChange={(event) => setDepositValue(event.target.value)}
                placeholder="0,00"
                className="input-field pl-10"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {[50, 100, 200, 500].map((value) => (
                <button key={value} onClick={() => setDepositValue(String(value))} className="px-3 py-1 text-sm rounded-lg bg-slate-100 hover:bg-primary/10 hover:text-primary transition-all font-medium">
                  R$ {value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Forma de pagamento</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDepositMethod('pix')}
                className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${depositMethod === 'pix' ? 'border-primary bg-primary/5' : 'border-slate-200'}`}
              >
                <QrCode size={20} className={depositMethod === 'pix' ? 'text-primary' : 'text-slate-400'} />
                <div className="text-left">
                  <div className="font-bold text-sm">PIX</div>
                  <div className="text-xs text-slate-500">Instantaneo</div>
                </div>
              </button>
              <button
                onClick={() => setDepositMethod('card')}
                className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${depositMethod === 'card' ? 'border-primary bg-primary/5' : 'border-slate-200'}`}
              >
                <CreditCard size={20} className={depositMethod === 'card' ? 'text-primary' : 'text-slate-400'} />
                <div className="text-left">
                  <div className="font-bold text-sm">Cartao</div>
                  <div className="text-xs text-slate-500">Credito/Debito</div>
                </div>
              </button>
            </div>
          </div>

          <button onClick={handleDeposit} disabled={!depositValue} className="btn-primary w-full disabled:opacity-50">
            Confirmar deposito
          </button>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Extrato</h2>
        <div className="card divide-y divide-slate-100">
          {TRANSACTIONS.map((transaction) => (
            <div key={transaction.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${transaction.type === 'credit' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                  {transaction.type === 'credit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </div>
                <div>
                  <div className="font-medium text-slate-900 text-sm">{transaction.desc}</div>
                  <div className="text-xs text-slate-400">{transaction.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                  {transaction.type === 'credit' ? '+' : ''}R$ {Math.abs(transaction.value)}
                </div>
                <div className={`text-xs ${transaction.status === 'Escrow' ? 'text-yellow-600' : 'text-slate-400'}`}>{transaction.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-50 flex gap-3 items-start">
        <ShieldCheck size={20} className="text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-slate-600">
          <strong>Pagamento protegido por escrow.</strong> O valor das consultas fica retido em nossa plataforma e so e liberado apos a realizacao da consulta. Em caso de cancelamento, o reembolso e automatico.
        </p>
      </div>
    </div>
  );
};

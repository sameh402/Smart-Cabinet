
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { HistoryPoint } from '../types';
import Logo from './Logo';

interface BIProps {
  data: HistoryPoint[];
}

const BIDashboard: React.FC<BIProps> = ({ data }) => {
  const handleExport = () => {
    window.print();
  };

  return (
    <div className="space-y-10" dir="rtl">
      {/* Report Header for Print Mode Only */}
      <div className="print-only mb-12 border-b-8 border-slate-900 pb-8">
        <div className="flex justify-between items-center">
          <Logo size="lg" />
          <div className="text-right">
            <h1 className="text-5xl font-black text-slate-900 mb-2">تقرير التحليل الرقمي</h1>
            <p className="text-slate-500 text-xl font-bold">DOT-SECURE-ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
            <p className="text-slate-400 font-bold">تاريخ التصدير: {new Date().toLocaleString('ar-EG')}</p>
          </div>
        </div>
      </div>

      {/* Screen View Header */}
      <div className="no-print flex justify-between items-center mb-6">
        <div className="text-right">
          <h2 className="text-4xl font-black text-[#0f172a] mb-1">تحليل التوجهات الزمنية</h2>
          <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">ENTERPRISE TELEMETRY VISUALIZATION</p>
        </div>
        <button 
          onClick={handleExport}
          className="px-10 py-4 bg-[#0f172a] text-white rounded-2xl text-lg font-black hover:bg-slate-800 transition-all shadow-[0_10px_20px_rgba(15,23,42,0.3)] active:scale-95"
        >
          تصدير كتقرير PDF
        </button>
      </div>

      {/* Main Chart Container - Fixed Height is CRITICAL for Recharts visibility */}
      <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm min-h-[500px] h-[60vh] w-full chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }}
              padding={{ left: 20, right: 20 }}
            />
            <YAxis 
              orientation="right" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} 
              domain={[0, 'auto']}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '20px', 
                border: 'none', 
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)', 
                fontWeight: '900',
                direction: 'rtl',
                padding: '16px'
              }}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              height={50} 
              iconType="circle" 
              wrapperStyle={{ fontSize: '16px', fontWeight: '900', paddingBottom: '20px' }} 
            />
            <Line 
              name="درجة الحرارة (°C)" 
              type="monotone" 
              dataKey="temperature" 
              stroke="#2563eb" 
              strokeWidth={5} 
              dot={false}
              isAnimationActive={true}
              activeDot={{ r: 8, strokeWidth: 0 }}
            />
            <Line 
              name="تركيز الغاز (%)" 
              type="monotone" 
              dataKey="gas" 
              stroke="#ea580c" 
              strokeWidth={5} 
              dot={false}
              isAnimationActive={true}
              activeDot={{ r: 8, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Cards Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-blue-50 border-2 border-blue-100 rounded-[2rem] text-right">
          <h4 className="text-blue-900 font-black text-xs uppercase mb-3 tracking-widest">حالة الاستقرار</h4>
          <p className="text-blue-800 text-xl font-bold leading-relaxed">بناءً على التوجه الحالي، النظام في حالة توازن حراري مستمر.</p>
        </div>
        <div className="p-8 bg-emerald-50 border-2 border-emerald-100 rounded-[2rem] text-right">
          <h4 className="text-emerald-900 font-black text-xs uppercase mb-3 tracking-widest">الصحة التشغيلية</h4>
          <p className="text-emerald-800 text-xl font-bold leading-relaxed">كفاءة الحساسات تعمل بنسبة 100% بدون أي انحراف معنوي مرصود.</p>
        </div>
        <div className="p-8 bg-red-50 border-2 border-red-100 rounded-[2rem] text-right">
          <h4 className="text-red-900 font-black text-xs uppercase mb-3 tracking-widest">توقعات الصيانة</h4>
          <p className="text-red-800 text-xl font-bold leading-relaxed">لا توجد مؤشرات على فشل كيميائي وشيك في وحدات البطاريات.</p>
        </div>
      </div>
      
      {/* Print Footer */}
      <div className="print-only mt-12 text-center text-slate-300 font-black uppercase tracking-[0.5em]">
        DIAMOND OILFIELD TECHNOLOGY • CONFIDENTIAL REPORT
      </div>
    </div>
  );
};

export default BIDashboard;

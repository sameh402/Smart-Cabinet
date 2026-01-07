import React, { useState, useEffect, useCallback } from 'react';
import GaugeChart from './components/GaugeChart';
import ExplosionCountdown from './components/ExplosionCountdown';
import AlarmSystem from './components/AlarmSystem';
import BIDashboard from './components/BIDashboard';
import Logo from './components/Logo';
import { SensorData, SafetyStatus, AIAnalysis, Page, HistoryPoint } from './types';
import { getSafetyAnalysis } from './services/geminiSafety';

const MAX_STABILITY_TIME = 600;

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('HOME');
  const [isCriticalSim, setIsCriticalSim] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Initialize with dummy data to ensure charts render something immediately
  const [history, setHistory] = useState<HistoryPoint[]>(() => {
    const initial: HistoryPoint[] = [];
    const now = Date.now();
    for (let i = 40; i >= 0; i--) {
      initial.push({
        time: new Date(now - i * 10000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: now - i * 10000,
        temperature: 24 + Math.random() * 2,
        pressure: 101.3,
        gas: 5 + Math.random() * 2
      });
    }
    return initial;
  });

  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 24.5,
    gasLevel: 5.2,
    batteryStability: 100,
    timeLeft: MAX_STABILITY_TIME,
    sensors: {
      BME680: { active: true, value: 0.1 },
      MQ8: { active: true, value: 0.5 },
      MQ7: { active: true, value: 0.3 },
      MQ2: { active: true, value: 0.2 },
      DHT22: { active: true, value: 24.5 },
      DS18B20: { active: true, value: 23.9 }
    }
  });

  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [safetyStatus, setSafetyStatus] = useState<SafetyStatus>(SafetyStatus.STABLE);

  // High-Frequency Physics Logic (100ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setSensorData(prev => {
        const drift = (Math.random() - 0.48) * 0.1; 
        const tempDelta = isCriticalSim ? 0.3 : drift;
        const gasDelta = isCriticalSim ? 0.25 : drift;

        const nextTemp = Math.min(100, Math.max(22, prev.temperature + tempDelta));
        const nextGas = Math.min(100, Math.max(2, prev.gasLevel + gasDelta));

        const isDecaying = nextTemp > 45 || nextGas > 30;
        const decayRate = (nextTemp > 75 || nextGas > 60) ? 1.0 : 0.05;
        const nextTime = isDecaying ? Math.max(0, prev.timeLeft - decayRate) : prev.timeLeft;

        return {
          ...prev,
          temperature: nextTemp,
          gasLevel: nextGas,
          timeLeft: nextTime,
          batteryStability: (nextTime / MAX_STABILITY_TIME) * 100
        };
      });
    }, 100);
    return () => clearInterval(timer);
  }, [isCriticalSim]);

  // Sync safety status based on current data
  useEffect(() => {
    if (sensorData.temperature > 85 || sensorData.gasLevel > 75) setSafetyStatus(SafetyStatus.CRITICAL);
    else if (sensorData.temperature > 50 || sensorData.gasLevel > 40) setSafetyStatus(SafetyStatus.WARNING);
    else setSafetyStatus(SafetyStatus.STABLE);
  }, [sensorData.temperature, sensorData.gasLevel]);

  // Periodic Data Logging for BI Dashboard (every 5 seconds)
  useEffect(() => {
    const logInterval = setInterval(() => {
      const now = new Date();
      const point: HistoryPoint = {
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        timestamp: now.getTime(),
        temperature: Number(sensorData.temperature.toFixed(2)),
        pressure: 101.3 + (Math.random() - 0.5),
        gas: Number(sensorData.gasLevel.toFixed(2))
      };
      setHistory(prev => [...prev.slice(-100), point]);
    }, 5000);
    return () => clearInterval(logInterval);
  }, [sensorData.temperature, sensorData.gasLevel]);

  const handleManualAnalysis = useCallback(async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      const analysis = await getSafetyAnalysis(sensorData);
      setAiAnalysis(analysis);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  }, [sensorData, isAnalyzing]);

  return (
    <div className={`min-h-screen transition-all duration-700 ${safetyStatus === SafetyStatus.CRITICAL ? 'critical-backlight' : 'bg-[#f0f2f5]'}`} dir="rtl">
      {/* Top Navigation */}
      <nav className="no-print bg-white border-b-2 border-slate-100 px-8 py-5 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-10">
          <Logo size="sm" />
          <div className="flex gap-4">
            <button onClick={() => setCurrentPage('HOME')} className={`px-6 py-2.5 rounded-2xl font-black text-base transition-all ${currentPage === 'HOME' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>الرئيسية</button>
            <button onClick={() => setCurrentPage('SENSORS')} className={`px-6 py-2.5 rounded-2xl font-black text-base transition-all ${currentPage === 'SENSORS' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>الحساسات</button>
            <button onClick={() => setCurrentPage('BI')} className={`px-6 py-2.5 rounded-2xl font-black text-base transition-all ${currentPage === 'BI' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>تحليل البيانات</button>
          </div>
        </div>
        <button 
          onClick={() => setIsCriticalSim(!isCriticalSim)} 
          className={`px-8 py-3 rounded-2xl text-base font-black transition-all shadow-md ${isCriticalSim ? 'bg-red-600 text-white animate-pulse' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          {isCriticalSim ? 'إيقاف المحاكاة' : 'تفعيل وضع الخطر'}
        </button>
      </nav>

      <main className="max-w-[1700px] mx-auto p-6 lg:p-10 space-y-10">
        <AlarmSystem status={safetyStatus} />

        {currentPage === 'HOME' && (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Redesigned AI Analysis Sidebar */}
            <aside className="lg:w-[360px] bg-[#0f172a] rounded-[2.5rem] p-10 text-white shadow-2xl flex flex-col gap-10 border-t-8 border-red-600 relative overflow-hidden flex-shrink-0">
               <div className="absolute top-8 left-8 h-4 w-4 rounded-full bg-red-600 shadow-[0_0_15px_#dc2626] animate-pulse"></div>
               
               <div className="text-center mt-4">
                 <h3 className="text-2xl font-black text-white leading-tight mb-1">تحليل الذكاء الاصطناعي</h3>
                 <span className="text-[11px] font-bold text-red-500 tracking-[0.3em] uppercase opacity-80">DOT SAFETY CORE V12</span>
               </div>

               <button 
                 onClick={handleManualAnalysis}
                 disabled={isAnalyzing}
                 className={`w-full py-5 rounded-2xl font-black text-xl transition-all shadow-2xl bg-white text-slate-900 hover:bg-slate-200 active:scale-95 flex items-center justify-center gap-3 ${isAnalyzing ? 'opacity-70 cursor-not-allowed' : ''}`}
               >
                 {isAnalyzing ? (
                   <>
                    <div className="h-5 w-5 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    جاري التحليل...
                   </>
                 ) : 'طلب تقرير الحالة'}
               </button>

               <div className="flex-1 space-y-12">
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <label className="text-[11px] font-black text-slate-500 uppercase block mb-3 tracking-widest">تقييم المخاطر</label>
                    <p className={`text-5xl font-black leading-tight ${aiAnalysis?.riskLevel.includes('429') || aiAnalysis?.riskLevel.includes('محلي') ? 'text-emerald-400' : (safetyStatus === SafetyStatus.CRITICAL ? 'text-red-500' : 'text-emerald-400')}`}>
                      {aiAnalysis?.riskLevel || "جاهز للتحليل"}
                    </p>
                  </div>

                  <div className="bg-white/5 p-7 rounded-[2rem] border-r-8 border-red-600 shadow-inner group hover:bg-white/10 transition-all">
                    <label className="text-[11px] font-black text-red-500 uppercase block mb-3 tracking-widest">توصية الخبير</label>
                    <p className="text-lg font-bold text-slate-100 leading-relaxed">
                      {aiAnalysis?.recommendation || "قم بطلب تحليل البيانات لمشاهدة التوصيات التقنية."}
                    </p>
                  </div>

                  <div className="bg-white/5 p-7 rounded-[2rem] border-r-8 border-blue-600 shadow-inner group hover:bg-white/10 transition-all">
                    <label className="text-[11px] font-black text-blue-500 uppercase block mb-3 tracking-widest">التوقعات</label>
                    <p className="text-base font-bold text-slate-400">
                      {aiAnalysis?.prediction || "بانتظار معالجة البيانات الفنية..."}
                    </p>
                  </div>
               </div>
               
               <div className="mt-4 pt-8 border-t border-white/5 flex justify-between items-center opacity-30 text-[10px] font-bold">
                 <span>TELEMETRY SYNC: OK</span>
                 <span>{new Date().toLocaleTimeString()}</span>
               </div>
            </aside>

            {/* Main Gauges and Countdown Bar */}
            <div className="flex-1 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <GaugeChart 
                  value={sensorData.gasLevel} 
                  label="كثافة الغاز (H2/CO)" 
                  unit="%" 
                />
                <GaugeChart 
                  value={sensorData.temperature} 
                  label="درجة حرارة السطح" 
                  unit="°C" 
                />
              </div>
              <ExplosionCountdown 
                timeLeft={Math.floor(sensorData.timeLeft)} 
                totalTime={MAX_STABILITY_TIME} 
                isActive={isCriticalSim || sensorData.temperature > 35} 
              />
            </div>
          </div>
        )}

        {currentPage === 'SENSORS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in zoom-in-95 duration-500">
            {/* Added explicit type casting for Object.entries to fix 'unknown' type inference error on 'data' */}
            {(Object.entries(sensorData.sensors) as [string, { active: boolean; value: number }][]).map(([name, data]) => (
              <div key={name} className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-sm flex flex-col items-center hover:border-blue-200 transition-all">
                <h3 className="text-2xl font-black text-slate-900 mb-8">{name}</h3>
                <GaugeChart 
                  value={data.value} 
                  label={name} 
                  unit={name.includes('DHT') ? "°C" : "%"} 
                  size="compact" 
                />
              </div>
            ))}
          </div>
        )}

        {currentPage === 'BI' && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-700">
            <BIDashboard data={history} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
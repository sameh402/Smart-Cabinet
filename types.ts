
export interface SensorData {
  temperature: number; 
  gasLevel: number;    
  batteryStability: number;
  timeLeft: number;
  sensors: {
    BME680: { active: boolean; value: number };
    MQ8: { active: boolean; value: number };
    MQ7: { active: boolean; value: number };
    MQ2: { active: boolean; value: number };
    DHT22: { active: boolean; value: number };
    DS18B20: { active: boolean; value: number };
  }
}

export enum SafetyStatus {
  STABLE = 'STABLE',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL'
}

export interface AIAnalysis {
  riskLevel: string;
  recommendation: string;
  prediction: string;
}

export interface HistoryPoint {
  time: string;
  timestamp: number;
  temperature: number;
  pressure: number;
  gas: number;
}

export type Page = 'HOME' | 'SENSORS' | 'BI';

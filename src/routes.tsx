import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PowerDistribution from './pages/PowerDistribution';
import Transformer from './pages/Transformer';
import ClassifiedEnergy from './pages/ClassifiedEnergy';
import ParameterQuery from './pages/ParameterQuery';
import OfflineEvents from './pages/OfflineEvents';
import EquipmentFault from './pages/EquipmentFault';
import EnergyWarning from './pages/EnergyWarning';
import AlarmClassification from './pages/AlarmClassification';
import AlarmAnalysis from './pages/AlarmAnalysis';
import SmsLog from './pages/SmsLog';
import StatisticsMeterReading from './pages/StatisticsMeterReading';
import StatisticsOperation from './pages/StatisticsOperation';
import StatisticsTimeSegment from './pages/StatisticsTimeSegment';
import StatisticsSupplement from './pages/StatisticsSupplement';
import StatisticsElectricFee from './pages/StatisticsElectricFee';
import StatisticsPowerFactor from './pages/StatisticsPowerFactor';
import StatisticsWaterFee from './pages/StatisticsWaterFee';
import AnalysisFlow from './pages/AnalysisFlow';
import AnalysisStatus from './pages/AnalysisStatus';
import AnalysisYOY from './pages/AnalysisYOY';
import AnalysisMOM from './pages/AnalysisMOM';
import AnalysisMaxDemand from './pages/AnalysisMaxDemand';
import AnalysisLoss from './pages/AnalysisLoss';
import EquipmentManagement from './pages/EquipmentManagement';
import SystemPrice from './pages/SystemPrice';
import SystemMeterStatus from './pages/SystemMeterStatus';
import SystemGatewayStatus from './pages/SystemGatewayStatus';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="/dashboard" />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'real-time/power-distribution',
        element: <PowerDistribution />,
      },
      {
        path: 'real-time/transformer',
        element: <Transformer />,
      },
      {
        path: 'real-time/classified',
        element: <ClassifiedEnergy />,
      },
      {
        path: 'real-time/query',
        element: <ParameterQuery />,
      },
      {
        path: 'real-time/offline',
        element: <OfflineEvents />,
      },
      {
        path: 'alarm/equipment-fault',
        element: <EquipmentFault />,
      },
      {
        path: 'alarm/energy-warning',
        element: <EnergyWarning />,
      },
      {
        path: 'alarm/classification',
        element: <AlarmClassification />,
      },
      {
        path: 'alarm/analysis',
        element: <AlarmAnalysis />,
      },
      {
        path: 'alarm/sms-log',
        element: <SmsLog />,
      },
      {
        path: 'statistics/meter-reading',
        element: <StatisticsMeterReading />,
      },
      {
        path: 'statistics/operation',
        element: <StatisticsOperation />,
      },
      {
        path: 'statistics/time-segment',
        element: <StatisticsTimeSegment />,
      },
      {
        path: 'statistics/supplement',
        element: <StatisticsSupplement />,
      },
      {
        path: 'statistics/electric-fee',
        element: <StatisticsElectricFee />,
      },
      {
        path: 'statistics/power-factor',
        element: <StatisticsPowerFactor />,
      },
      {
        path: 'statistics/water-fee',
        element: <StatisticsWaterFee />,
      },
      {
        path: 'analysis/flow',
        element: <AnalysisFlow />,
      },
      {
        path: 'analysis/status',
        element: <AnalysisStatus />,
      },
      {
        path: 'analysis/yoy',
        element: <AnalysisYOY />,
      },
      {
        path: 'analysis/mom',
        element: <AnalysisMOM />,
      },
      {
        path: 'analysis/max-demand',
        element: <AnalysisMaxDemand />,
      },
      {
        path: 'analysis/loss',
        element: <AnalysisLoss />,
      },
      {
        path: 'system/price',
        element: <SystemPrice />,
      },
      {
        path: 'system/equipment',
        element: <EquipmentManagement />,
      },
      {
        path: 'system/communication',
        element: <SystemGatewayStatus />,
      },
      {
        path: 'system/meter-status',
        element: <SystemMeterStatus />,
      },
      {
        path: 'system/gateway-status',
        element: <SystemGatewayStatus />,
      },
    ],
  },
]);

export default router;
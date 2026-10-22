import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import PageLoader from './components/PageLoader';

// 路由级代码分割：31 个页面按需加载，显著降低首屏体积
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PowerDistribution = lazy(() => import('./pages/PowerDistribution'));
const Transformer = lazy(() => import('./pages/Transformer'));
const ClassifiedEnergy = lazy(() => import('./pages/ClassifiedEnergy'));
const ParameterQuery = lazy(() => import('./pages/ParameterQuery'));
const OfflineEvents = lazy(() => import('./pages/OfflineEvents'));
const EquipmentFault = lazy(() => import('./pages/EquipmentFault'));
const EnergyWarning = lazy(() => import('./pages/EnergyWarning'));
const AlarmClassification = lazy(() => import('./pages/AlarmClassification'));
const AlarmAnalysis = lazy(() => import('./pages/AlarmAnalysis'));
const SmsLog = lazy(() => import('./pages/SmsLog'));
const StatisticsMeterReading = lazy(() => import('./pages/StatisticsMeterReading'));
const StatisticsOperation = lazy(() => import('./pages/StatisticsOperation'));
const StatisticsTimeSegment = lazy(() => import('./pages/StatisticsTimeSegment'));
const StatisticsSupplement = lazy(() => import('./pages/StatisticsSupplement'));
const StatisticsElectricFee = lazy(() => import('./pages/StatisticsElectricFee'));
const StatisticsPowerFactor = lazy(() => import('./pages/StatisticsPowerFactor'));
const StatisticsWaterFee = lazy(() => import('./pages/StatisticsWaterFee'));
const AnalysisFlow = lazy(() => import('./pages/AnalysisFlow'));
const AnalysisStatus = lazy(() => import('./pages/AnalysisStatus'));
const AnalysisYOY = lazy(() => import('./pages/AnalysisYOY'));
const AnalysisMOM = lazy(() => import('./pages/AnalysisMOM'));
const AnalysisMaxDemand = lazy(() => import('./pages/AnalysisMaxDemand'));
const AnalysisLoss = lazy(() => import('./pages/AnalysisLoss'));
const EquipmentManagement = lazy(() => import('./pages/EquipmentManagement'));
const SystemPrice = lazy(() => import('./pages/SystemPrice'));
const SystemMeterStatus = lazy(() => import('./pages/SystemMeterStatus'));
const SystemGatewayStatus = lazy(() => import('./pages/SystemGatewayStatus'));
const NotFound = lazy(() => import('./pages/NotFound'));

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoader />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: '', element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'real-time/power-distribution', element: <PowerDistribution /> },
      { path: 'real-time/transformer', element: <Transformer /> },
      { path: 'real-time/classified', element: <ClassifiedEnergy /> },
      { path: 'real-time/query', element: <ParameterQuery /> },
      { path: 'real-time/offline', element: <OfflineEvents /> },
      { path: 'alarm/equipment-fault', element: <EquipmentFault /> },
      { path: 'alarm/energy-warning', element: <EnergyWarning /> },
      { path: 'alarm/classification', element: <AlarmClassification /> },
      { path: 'alarm/analysis', element: <AlarmAnalysis /> },
      { path: 'alarm/sms-log', element: <SmsLog /> },
      { path: 'statistics/meter-reading', element: <StatisticsMeterReading /> },
      { path: 'statistics/operation', element: <StatisticsOperation /> },
      { path: 'statistics/time-segment', element: <StatisticsTimeSegment /> },
      { path: 'statistics/supplement', element: <StatisticsSupplement /> },
      { path: 'statistics/electric-fee', element: <StatisticsElectricFee /> },
      { path: 'statistics/power-factor', element: <StatisticsPowerFactor /> },
      { path: 'statistics/water-fee', element: <StatisticsWaterFee /> },
      { path: 'analysis/flow', element: <AnalysisFlow /> },
      { path: 'analysis/status', element: <AnalysisStatus /> },
      { path: 'analysis/yoy', element: <AnalysisYOY /> },
      { path: 'analysis/mom', element: <AnalysisMOM /> },
      { path: 'analysis/max-demand', element: <AnalysisMaxDemand /> },
      { path: 'analysis/loss', element: <AnalysisLoss /> },
      { path: 'system/price', element: <SystemPrice /> },
      { path: 'system/equipment', element: <EquipmentManagement /> },
      { path: 'system/meter-status', element: <SystemMeterStatus /> },
      { path: 'system/gateway-status', element: <SystemGatewayStatus /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default router;

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Table as TableIcon, 
  Users, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  HardDrive,
  Server,
  Cloud,
  Shield,
  Zap,
  FileText,
  ImageIcon,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

interface DatabaseStats {
  totalSize: string;
  tableCount: number;
  totalRows: number;
  lastBackup: string;
  backupStatus: 'success' | 'failed' | 'pending';
}

interface TableInfo {
  name: string;
  rowCount: number;
  size: string;
  lastUpdated: string;
  growthRate: number;
}

interface DatabaseActivity {
  timestamp: string;
  operation: string;
  table: string;
  user: string;
  status: 'success' | 'failed';
  duration: number;
}

interface PerformanceMetrics {
  avgQueryTime: number;
  slowQueries: number;
  connectionCount: number;
  maxConnections: number;
  cacheHitRate: number;
}

export default function DatabaseOverview() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dbStats, setDbStats] = useState<DatabaseStats | null>(null);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [activity, setActivity] = useState<DatabaseActivity[]>([]);
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    loadDatabaseData();
  }, []);

  const loadDatabaseData = async () => {
    try {
      setLoading(true);
      
      // Load database stats
      const statsResponse = await fetch('/api/admin/database/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setDbStats(statsData);
      }

      // Load table information
      const tablesResponse = await fetch('/api/admin/database/tables');
      if (tablesResponse.ok) {
        const tablesData = await tablesResponse.json();
        setTables(tablesData);
      }

      // Load activity log
      const activityResponse = await fetch('/api/admin/database/activity');
      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        setActivity(activityData);
      }

      // Load performance metrics
      const performanceResponse = await fetch('/api/admin/database/performance');
      if (performanceResponse.ok) {
        const performanceData = await performanceResponse.json();
        setPerformance(performanceData);
      }
    } catch (error) {
      console.error('Failed to load database data:', error);
      setError('載入數據庫信息失敗');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const getGrowthIcon = (rate: number) => {
    if (rate > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (rate < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return null;
  };

  const getTableIcon = (tableName: string) => {
    if (tableName.includes('User')) return <Users className="w-4 h-4" />;
    if (tableName.includes('Card')) return <CreditCard className="w-4 h-4" />;
    if (tableName.includes('Appointment')) return <Calendar className="w-4 h-4" />;
    if (tableName.includes('Booking')) return <Calendar className="w-4 h-4" />;
    if (tableName.includes('Job')) return <FileText className="w-4 h-4" />;
    if (tableName.includes('Image') || tableName.includes('Photo')) return <ImageIcon className="w-4 h-4" />;
    if (tableName.includes('Mail') || tableName.includes('Email')) return <Mail className="w-4 h-4" />;
    if (tableName.includes('Phone')) return <Phone className="w-4 h-4" />;
    if (tableName.includes('Address') || tableName.includes('Location')) return <MapPin className="w-4 h-4" />;
    return <TableIcon className="w-4 h-4" />;
  };

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p>載入數據庫信息中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">數據庫概覽</h2>
          <p className="text-gray-600">監控數據庫性能、表結構和活動記錄</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadDatabaseData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新數據
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            備份數據庫
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Database Stats Overview */}
      {dbStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">數據庫大小</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dbStats.totalSize}</div>
              <p className="text-xs text-muted-foreground">
                {dbStats.tableCount} 個表
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">總記錄數</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dbStats.totalRows.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                所有表的記錄總數
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">最後備份</CardTitle>
              <Cloud className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(dbStats.lastBackup).toLocaleDateString('zh-TW')}
              </div>
              <p className="text-xs text-muted-foreground">
                <Badge variant={dbStats.backupStatus === 'success' ? 'default' : 'destructive'}>
                  {dbStats.backupStatus === 'success' ? '成功' : '失敗'}
                </Badge>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">系統狀態</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Badge variant="default">正常</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                所有服務運行正常
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Metrics */}
      {performance && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              性能指標
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">平均查詢時間</span>
                  <span className="text-sm text-gray-600">{performance.avgQueryTime}ms</span>
                </div>
                <Progress value={Math.min((performance.avgQueryTime / 100) * 100, 100)} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">慢查詢數量</span>
                  <span className="text-sm text-gray-600">{performance.slowQueries}</span>
                </div>
                <Progress value={Math.min((performance.slowQueries / 10) * 100, 100)} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">連接數量</span>
                  <span className="text-sm text-gray-600">
                    {performance.connectionCount}/{performance.maxConnections}
                  </span>
                </div>
                <Progress 
                  value={(performance.connectionCount / performance.maxConnections) * 100} 
                  className="h-2" 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">緩存命中率</span>
                  <span className="text-sm text-gray-600">{performance.cacheHitRate}%</span>
                </div>
                <Progress value={performance.cacheHitRate} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="tables" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tables">數據表</TabsTrigger>
          <TabsTrigger value="activity">活動記錄</TabsTrigger>
          <TabsTrigger value="performance">性能分析</TabsTrigger>
        </TabsList>

        <TabsContent value="tables">
          <Card>
            <CardHeader>
              <CardTitle>數據表信息</CardTitle>
              <CardDescription>
                所有數據表的詳細信息和統計數據
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>表名</TableHead>
                      <TableHead>記錄數</TableHead>
                      <TableHead>大小</TableHead>
                      <TableHead>最後更新</TableHead>
                      <TableHead>增長率</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tables.map((table) => (
                      <TableRow key={table.name}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getTableIcon(table.name)}
                            <span className="font-medium">{table.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{table.rowCount.toLocaleString()}</TableCell>
                        <TableCell>{table.size}</TableCell>
                        <TableCell>
                          {new Date(table.lastUpdated).toLocaleDateString('zh-TW')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {getGrowthIcon(table.growthRate)}
                            <span className={`text-sm ${
                              table.growthRate > 0 ? 'text-green-600' : 
                              table.growthRate < 0 ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {table.growthRate > 0 ? '+' : ''}{table.growthRate}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>數據庫活動記錄</CardTitle>
              <CardDescription>
                最近的數據庫操作和活動記錄
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activity.map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-2 h-2 rounded-full ${
                        log.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-medium">{log.operation}</p>
                        <p className="text-sm text-gray-500">
                          {log.table} • {log.user} • {formatDuration(log.duration)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString('zh-TW')}
                      </p>
                      <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                        {log.status === 'success' ? '成功' : '失敗'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>查詢性能</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>平均查詢時間</span>
                    <span className="font-medium">{performance?.avgQueryTime}ms</span>
                  </div>
                  <Progress value={Math.min(((performance?.avgQueryTime || 0) / 100) * 100, 100)} />
                  
                  <div className="flex justify-between items-center">
                    <span>慢查詢數量</span>
                    <span className="font-medium">{performance?.slowQueries}</span>
                  </div>
                  <Progress value={Math.min(((performance?.slowQueries || 0) / 10) * 100, 100)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>連接狀態</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>當前連接數</span>
                    <span className="font-medium">
                      {performance?.connectionCount}/{performance?.maxConnections}
                    </span>
                  </div>
                  <Progress 
                    value={((performance?.connectionCount || 0) / (performance?.maxConnections || 1)) * 100} 
                  />
                  
                  <div className="flex justify-between items-center">
                    <span>緩存命中率</span>
                    <span className="font-medium">{performance?.cacheHitRate}%</span>
                  </div>
                  <Progress value={performance?.cacheHitRate || 0} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
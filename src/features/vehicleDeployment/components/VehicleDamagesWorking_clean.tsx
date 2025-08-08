import React, { useState, useEffect, useCallback } from 'react';
import { VehicleTrackerLayout } from './VehicleTrackerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  AlertTriangle, 
  Plus, 
  Search, 
  Camera, 
  FileText, 
  Calendar,
  Car,
  User,
  Clock,
  Eye,
  Download,
  Edit,
  CheckCircle,
  XCircle,
  TrendingUp,
  RefreshCw,
  MapPin,
  Activity,
  BarChart3,
  Filter,
  Wrench,
  DollarSign,
  Wifi,
  WifiOff
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { vehicleService } from '../../../services/database';
import { Deployment } from '../../../types/vehicle';
import { useToast } from '../../../hooks/use-toast';
import { useOfflineSync } from '../../../hooks/useOfflineSync';
import DamageReportForm from './DamageReportForm';

interface DamageReport {
  id: string;
  vehicleNumber: string;
  reportedBy: string;
  reportedDate: string;
  damageType: 'minor' | 'major' | 'critical';
  category: 'body' | 'mechanical' | 'electrical' | 'interior' | 'tire';
  location: string;
  description: string;
  estimatedCost: number;
  actualCost?: number;
  status: 'reported' | 'inspecting' | 'approved' | 'repairing' | 'completed' | 'rejected';
  photos: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deploymentId?: string;
  source: 'checklist' | 'manual_report' | 'inspection';
  timestamp: string;
  supervisorName?: string;
  checklistType?: 'out' | 'in';
}

interface DamageStats {
  totalReports: number;
  pendingRepairs: number;
  completedRepairs: number;
  totalEstimatedCost: number;
  totalActualCost: number;
  averageRepairTime: number;
  mostDamagedVehicle: string;
  damagesByCategory: Record<string, number>;
  damagesByPriority: Record<string, number>;
}

export const VehicleDamages: React.FC = () => {
  const [damages, setDamages] = useState<DamageReport[]>([]);
  const [filteredDamages, setFilteredDamages] = useState<DamageReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [retryCount, setRetryCount] = useState(0);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const { toast } = useToast();
  const { isOnline: syncOnline, submitFormData } = useOfflineSync();

  // Load deployments on component mount
  useEffect(() => {
    const loadDeployments = async () => {
      try {
        const data = await vehicleService.getDeploymentHistory();
        setDeployments(data);
      } catch (error) {
        console.error('Error loading deployments:', error);
        toast({
          title: "Error",
          description: "Failed to load deployment data",
          variant: "destructive",
        });
      }
    };
    loadDeployments();
  }, []);

  // Enhanced error handling with retry logic
  const withRetry = async <T,>(operation: () => Promise<T>, maxRetries = 3): Promise<T> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation();
        setRetryCount(0);
        return result;
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        
        if (attempt === maxRetries) {
          setRetryCount(attempt);
          throw error;
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
    throw new Error('Max retries exceeded');
  };

  // Enhanced cost estimation with backend integration
  const getEstimatedCost = useCallback(async (damageDescription: string, category: string): Promise<number> => {
    try {
      // In production, this would call a machine learning API for cost estimation
      const response = await fetch('/api/damage-cost-estimation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: damageDescription, category })
      });
      
      if (response.ok) {
        const { estimatedCost } = await response.json();
        return estimatedCost;
      }
    } catch (error) {
      console.warn('Backend cost estimation failed, using fallback logic:', error);
    }
    
    // Fallback to client-side logic
    return estimateRepairCostFallback(damageDescription);
  }, []);

  // Fallback cost estimation
  const estimateRepairCostFallback = (description: string): number => {
    const lowercaseDesc = description.toLowerCase();
    const baseCosts = {
      critical: { min: 30000, max: 80000 },
      major: { min: 10000, max: 35000 },
      minor: { min: 2000, max: 12000 }
    };
    
    let costRange = baseCosts.minor;
    if (lowercaseDesc.includes('critical') || lowercaseDesc.includes('engine')) {
      costRange = baseCosts.critical;
    } else if (lowercaseDesc.includes('major') || lowercaseDesc.includes('collision')) {
      costRange = baseCosts.major;
    }
    
    return Math.floor(Math.random() * (costRange.max - costRange.min) + costRange.min);
  };

  // Helper functions for damage analysis
  const categorizeDamageType = (description: string): DamageReport['damageType'] => {
    const lowercaseDesc = description.toLowerCase();
    if (lowercaseDesc.includes('critical') || lowercaseDesc.includes('severe') || 
        lowercaseDesc.includes('major accident') || lowercaseDesc.includes('engine')) {
      return 'critical';
    } else if (lowercaseDesc.includes('major') || lowercaseDesc.includes('significant') ||
               lowercaseDesc.includes('collision') || lowercaseDesc.includes('dent')) {
      return 'major';
    }
    return 'minor';
  };

  const categorizeDamageCategory = (description: string): DamageReport['category'] => {
    const lowercaseDesc = description.toLowerCase();
    if (lowercaseDesc.includes('engine') || lowercaseDesc.includes('brake') || 
        lowercaseDesc.includes('mechanical') || lowercaseDesc.includes('transmission')) {
      return 'mechanical';
    } else if (lowercaseDesc.includes('light') || lowercaseDesc.includes('electrical') ||
               lowercaseDesc.includes('battery') || lowercaseDesc.includes('wiring')) {
      return 'electrical';
    } else if (lowercaseDesc.includes('seat') || lowercaseDesc.includes('interior') ||
               lowercaseDesc.includes('dashboard') || lowercaseDesc.includes('upholstery')) {
      return 'interior';
    } else if (lowercaseDesc.includes('tire') || lowercaseDesc.includes('wheel') ||
               lowercaseDesc.includes('puncture') || lowercaseDesc.includes('tyre')) {
      return 'tire';
    }
    return 'body';
  };

  const extractLocation = (description: string): string => {
    const lowercaseDesc = description.toLowerCase();
    if (lowercaseDesc.includes('front')) return 'Front';
    if (lowercaseDesc.includes('rear') || lowercaseDesc.includes('back')) return 'Rear';
    if (lowercaseDesc.includes('left')) return 'Left Side';
    if (lowercaseDesc.includes('right')) return 'Right Side';
    if (lowercaseDesc.includes('door')) return 'Door';
    if (lowercaseDesc.includes('bumper')) return 'Bumper';
    if (lowercaseDesc.includes('windshield')) return 'Windshield';
    if (lowercaseDesc.includes('engine')) return 'Engine';
    if (lowercaseDesc.includes('tire') || lowercaseDesc.includes('wheel')) return 'Wheel/Tire';
    return 'General';
  };

  const determinePriority = (description: string): DamageReport['priority'] => {
    const lowercaseDesc = description.toLowerCase();
    if (lowercaseDesc.includes('critical') || lowercaseDesc.includes('safety') ||
        lowercaseDesc.includes('brake') || lowercaseDesc.includes('engine')) {
      return 'urgent';
    } else if (lowercaseDesc.includes('major') || lowercaseDesc.includes('significant') ||
               lowercaseDesc.includes('lights')) {
      return 'high';
    } else if (lowercaseDesc.includes('minor') || lowercaseDesc.includes('cosmetic')) {
      return 'low';
    }
    return 'medium';
  };

  // Enhanced real-world data integration with caching and optimization
  const extractDamagesFromDeployments = useCallback(async () => {
    if (!deployments || deployments.length === 0) {
      setDamages([]);
      setFilteredDamages([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Check for cached data first
      const cacheKey = 'damage-reports-cache';
      const cacheExpiry = 5 * 60 * 1000; // 5 minutes
      const cachedData = localStorage.getItem(cacheKey);
      const cacheTimestamp = localStorage.getItem(`${cacheKey}-timestamp`);
      
      if (cachedData && cacheTimestamp) {
        const age = Date.now() - parseInt(cacheTimestamp);
        if (age < cacheExpiry && isOnline) {
          const cached = JSON.parse(cachedData);
          setDamages(cached);
          setFilteredDamages(cached);
          setLoading(false);
          return;
        }
      }
      
      // Process deployments to extract damages
      const damageReports: DamageReport[] = [];
      
      for (const deployment of deployments) {
        // Extract damages from OUT checklist
        if (deployment.outData?.vehicleChecklist?.damages && deployment.outData.vehicleChecklist.damages.trim()) {
          const estimatedCost = await getEstimatedCost(
            deployment.outData.vehicleChecklist.damages, 
            categorizeDamageCategory(deployment.outData.vehicleChecklist.damages)
          );

          const outDamage: DamageReport = {
            id: `${deployment.id}-out-damage`,
            vehicleNumber: deployment.vehicleNumber,
            reportedBy: deployment.outData.supervisorName || 'Unknown Supervisor',
            reportedDate: deployment.outTimestamp || new Date().toISOString(),
            damageType: categorizeDamageType(deployment.outData.vehicleChecklist.damages),
            category: categorizeDamageCategory(deployment.outData.vehicleChecklist.damages),
            location: extractLocation(deployment.outData.vehicleChecklist.damages),
            description: deployment.outData.vehicleChecklist.damages,
            estimatedCost,
            status: 'reported',
            photos: deployment.outData.vehiclePhotos || [],
            priority: determinePriority(deployment.outData.vehicleChecklist.damages),
            deploymentId: deployment.id,
            source: 'checklist',
            timestamp: deployment.outTimestamp || new Date().toISOString(),
            supervisorName: deployment.outData.supervisorName,
            checklistType: 'out'
          };
          damageReports.push(outDamage);
        }

        // Extract damages from IN checklist
        if (deployment.inData?.vehicleChecklist?.damages && 
            deployment.inData.vehicleChecklist.damages.trim() &&
            deployment.inData.vehicleChecklist.damages !== deployment.outData?.vehicleChecklist?.damages) {
          
          const estimatedCost = await getEstimatedCost(
            deployment.inData.vehicleChecklist.damages,
            categorizeDamageCategory(deployment.inData.vehicleChecklist.damages)
          );

          const inDamage: DamageReport = {
            id: `${deployment.id}-in-damage`,
            vehicleNumber: deployment.vehicleNumber,
            reportedBy: deployment.inData.inSupervisorName || 'Unknown Supervisor',
            reportedDate: deployment.inTimestamp || new Date().toISOString(),
            damageType: categorizeDamageType(deployment.inData.vehicleChecklist.damages),
            category: categorizeDamageCategory(deployment.inData.vehicleChecklist.damages),
            location: extractLocation(deployment.inData.vehicleChecklist.damages),
            description: deployment.inData.vehicleChecklist.damages,
            estimatedCost,
            status: 'reported',
            photos: deployment.inData.vehiclePhotos || [],
            priority: determinePriority(deployment.inData.vehicleChecklist.damages),
            deploymentId: deployment.id,
            source: 'checklist',
            timestamp: deployment.inTimestamp || new Date().toISOString(),
            supervisorName: deployment.inData.inSupervisorName,
            checklistType: 'in'
          };
          damageReports.push(inDamage);
        }
      }

      // Cache the results
      localStorage.setItem(cacheKey, JSON.stringify(damageReports));
      localStorage.setItem(`${cacheKey}-timestamp`, Date.now().toString());

      setDamages(damageReports);
      setFilteredDamages(damageReports);
      
      toast({
        title: "Damage Reports Updated",
        description: `Found ${damageReports.length} damage reports from deployment records`,
      });
      
    } catch (error) {
      console.error('Error extracting damage reports:', error);
      
      toast({
        title: "Error",
        description: "Failed to load damage reports. Check your connection.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  }, [deployments, isOnline, getEstimatedCost, toast]);

  // Load damage reports when deployments change
  useEffect(() => {
    if (deployments.length > 0) {
      extractDamagesFromDeployments();
    }
  }, [deployments, extractDamagesFromDeployments]);

  // Filter damages based on search and filters
  useEffect(() => {
    let filtered = damages;

    if (searchTerm) {
      filtered = filtered.filter(damage =>
        damage.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        damage.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        damage.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        damage.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        damage.deploymentId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(damage => damage.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(damage => damage.priority === priorityFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(damage => damage.category === categoryFilter);
    }

    setFilteredDamages(filtered);
  }, [damages, searchTerm, statusFilter, priorityFilter, categoryFilter]);

  const getStatusColor = (status: DamageReport['status']) => {
    const colors = {
      reported: 'bg-blue-100 text-blue-800 border-blue-200',
      inspecting: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      repairing: 'bg-orange-100 text-orange-800 border-orange-200',
      completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status];
  };

  const getPriorityColor = (priority: DamageReport['priority']) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStats = (): DamageStats => {
    const totalReports = damages.length;
    const pendingRepairs = damages.filter(d => ['reported', 'inspecting', 'approved', 'repairing'].includes(d.status)).length;
    const completedRepairs = damages.filter(d => d.status === 'completed').length;
    const totalEstimatedCost = damages.reduce((sum, d) => sum + d.estimatedCost, 0);
    const totalActualCost = damages.reduce((sum, d) => sum + (d.actualCost || 0), 0);

    // Calculate average repair time
    const completedWithDates = damages.filter(d => d.status === 'completed' && d.reportedDate);
    const averageRepairTime = completedWithDates.length > 0 ? 
      completedWithDates.reduce((sum, d) => {
        const reported = new Date(d.reportedDate);
        const completed = new Date(d.timestamp);
        return sum + (completed.getTime() - reported.getTime());
      }, 0) / completedWithDates.length / (1000 * 60 * 60 * 24) : 0; // in days

    // Find most damaged vehicle
    const vehicleCounts = damages.reduce((acc, d) => {
      acc[d.vehicleNumber] = (acc[d.vehicleNumber] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostDamagedVehicle = Object.entries(vehicleCounts).reduce((a, b) => 
      vehicleCounts[a[0]] > vehicleCounts[b[0]] ? a : b
    )?.[0] || 'None';

    // Group by category
    const damagesByCategory = damages.reduce((acc, d) => {
      acc[d.category] = (acc[d.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by priority
    const damagesByPriority = damages.reduce((acc, d) => {
      acc[d.priority] = (acc[d.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalReports,
      pendingRepairs,
      completedRepairs,
      totalEstimatedCost,
      totalActualCost,
      averageRepairTime,
      mostDamagedVehicle,
      damagesByCategory,
      damagesByPriority
    };
  };

  const stats = getStats();

  const DamageCard = ({ damage }: { damage: DamageReport }) => (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{damage.vehicleNumber}</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {damage.location} • {damage.category}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getPriorityColor(damage.priority)}>
              {damage.priority.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-700 line-clamp-2">{damage.description}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Reported by: {damage.reportedBy}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{formatDate(damage.reportedDate)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">
                Cost: ₹{(damage.actualCost || damage.estimatedCost).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <Badge className={getStatusColor(damage.status)}>
            {damage.status.charAt(0).toUpperCase() + damage.status.slice(1)}
          </Badge>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-2">
              <Eye className="w-4 h-4" />
              View
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <VehicleTrackerLayout 
      title="🛠️ Vehicle Damages" 
      subtitle="Track and manage vehicle damage reports and repairs"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-800">Damage Management</h2>
            <Badge variant="outline" className="text-xs">
              {stats.totalReports} Total Reports
            </Badge>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
                  <Plus className="w-4 h-4" />
                  Report Damage
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DamageReportForm 
                  onSubmit={(data) => {
                    console.log('New damage report:', data);
                    setIsCreateDialogOpen(false);
                  }}
                  onCancel={() => setIsCreateDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white">
            📋 Overview
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-white">
            📑 All Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">Total Reports</p>
                      <p className="text-2xl font-bold text-blue-900">{stats.totalReports}</p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-700">Pending</p>
                      <p className="text-2xl font-bold text-yellow-900">{stats.pendingRepairs}</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">Completed</p>
                      <p className="text-2xl font-bold text-green-900">{stats.completedRepairs}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">Total Cost</p>
                      <p className="text-2xl font-bold text-purple-900">₹{stats.totalEstimatedCost.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Damages */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Damage Reports</CardTitle>
                <CardDescription>Latest reported vehicle damages from deployment records</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin text-gray-400 mr-2" />
                    <span className="text-gray-600">Loading damage reports...</span>
                  </div>
                ) : damages.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {damages.slice(0, 4).map((damage) => (
                      <DamageCard key={damage.id} damage={damage} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No damage reports found</p>
                    <p className="text-sm text-gray-500">
                      Damage reports are automatically generated from deployment checklists
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search damage reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="reported">Reported</SelectItem>
                      <SelectItem value="inspecting">Inspecting</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="repairing">Repairing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="body">Body</SelectItem>
                      <SelectItem value="mechanical">Mechanical</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="interior">Interior</SelectItem>
                      <SelectItem value="tire">Tire</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={extractDamagesFromDeployments}
                    disabled={loading}
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
                
                <div className="mt-3 text-sm text-gray-600">
                  Showing {filteredDamages.length} of {damages.length} damage reports
                </div>
              </CardContent>
            </Card>

            {/* All Damages */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mr-3" />
                <span className="text-gray-600">Loading damage reports from deployment data...</span>
              </div>
            ) : filteredDamages.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDamages.map((damage) => (
                  <DamageCard key={damage.id} damage={damage} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Damage Reports Found</h3>
                  <p className="text-gray-600 mb-4">
                    {damages.length === 0 
                      ? "No damages have been reported from deployment checklists yet." 
                      : "No damages match your current filters."
                    }
                  </p>
                  <p className="text-sm text-gray-500">
                    Damage reports are automatically generated from vehicle checklist entries during deployments.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </VehicleTrackerLayout>
  );
};

export default VehicleDamages;

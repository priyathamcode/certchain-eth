import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Coins, 
  CheckCircle, 
  Users, 
  TrendingUp,
  ArrowRight,
  Clock,
  FileText,
  Shield
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/app'

const stats = [
  {
    title: 'Total Certificates',
    value: '1,234',
    change: '+12%',
    changeType: 'positive' as const,
    icon: FileText,
    color: 'text-blue-600'
  },
  {
    title: 'Active Certificates',
    value: '1,156',
    change: '+8%',
    changeType: 'positive' as const,
    icon: CheckCircle,
    color: 'text-green-600'
  },
  {
    title: 'Pending Verifications',
    value: '23',
    change: '-5%',
    changeType: 'negative' as const,
    icon: Clock,
    color: 'text-yellow-600'
  },
  {
    title: 'Total Users',
    value: '456',
    change: '+15%',
    changeType: 'positive' as const,
    icon: Users,
    color: 'text-purple-600'
  }
]

const quickActions = [
  {
    title: 'Mint Certificate',
    description: 'Create a new certificate for a recipient',
    icon: Coins,
    href: '/mint',
    color: 'bg-blue-500'
  },
  {
    title: 'Verify Certificate',
    description: 'Check the validity of a certificate',
    icon: CheckCircle,
    href: '/verify',
    color: 'bg-green-500'
  },
  {
    title: 'Admin Panel',
    description: 'Manage certificates and settings',
    icon: Shield,
    href: '/admin',
    color: 'bg-purple-500'
  }
]

const recentActivity = [
  {
    id: 1,
    action: 'Certificate minted',
    recipient: '0x1234...5678',
    time: '2 minutes ago',
    status: 'success'
  },
  {
    id: 2,
    action: 'Certificate verified',
    recipient: '0x8765...4321',
    time: '5 minutes ago',
    status: 'success'
  },
  {
    id: 3,
    action: 'Certificate revoked',
    recipient: '0x1111...2222',
    time: '1 hour ago',
    status: 'error'
  }
]

export default function Dashboard() {
  const { addNotification } = useAppStore()

  const handleQuickAction = (action: typeof quickActions[0]) => {
    addNotification({
      type: 'info',
      title: 'Action Started',
      message: `Navigating to ${action.title}...`,
      duration: 2000
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to CertChain. Manage your certificates and track their status.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Card key={action.title} className="card-hover cursor-pointer">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={action.href}>
                    <Button 
                      className="w-full" 
                      onClick={() => handleQuickAction(action)}
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid gap-6 lg:grid-cols-2"
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest certificate operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.recipient} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Current system health and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Blockchain Connection</span>
                <span className="text-sm text-green-600">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Status</span>
                <span className="text-sm text-green-600">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <span className="text-sm text-green-600">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Sync</span>
                <span className="text-sm text-muted-foreground">2 minutes ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 
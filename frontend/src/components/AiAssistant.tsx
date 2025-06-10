import React, { useState } from 'react';
import { Bot, Send, Lightbulb, FileText, Users, AlertTriangle, TrendingUp, Clock, CheckCircle } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  category?: 'bug' | 'progress' | 'workload' | 'general';
}

interface ProjectData {
  totalTasks: number;
  completedTasks: number;
  pendingIssues: number;
  teamMembers: Array<{
    name: string;
    workload: number;
    currentTasks: number;
  }>;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '👋 Hello! I\'m your AI Assistant. I can help you with:\n• Bug solutions and troubleshooting\n• Project progress summaries\n• Team workload analysis\n• General office management queries',
      timestamp: new Date(),
      category: 'general'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock project data - replace with real data from your backend
  const projectData: ProjectData = {
    totalTasks: 45,
    completedTasks: 32,
    pendingIssues: 8,
    teamMembers: [
      { name: 'Rahul Singh', workload: 85, currentTasks: 7 },
      { name: 'Priya Sharma', workload: 92, currentTasks: 9 },
      { name: 'Amit Kumar', workload: 65, currentTasks: 5 },
      { name: 'Sneha Patel', workload: 78, currentTasks: 6 }
    ]
  };

  const quickActions = [
    { icon: FileText, label: 'Summarize Progress', action: 'summarize project progress' },
    { icon: Users, label: 'Check Workload', action: 'find who\'s overloaded' },
    { icon: AlertTriangle, label: 'Bug Solutions', action: 'suggest solutions for common bugs' },
    { icon: TrendingUp, label: 'Performance Stats', action: 'show performance metrics' }
  ];

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('progress') || input.includes('summary') || input.includes('project')) {
      const completionRate = Math.round((projectData.completedTasks / projectData.totalTasks) * 100);
      return `📊 **Project Progress Summary:**
      
• **Completion Rate:** ${completionRate}% (${projectData.completedTasks}/${projectData.totalTasks} tasks)
• **Pending Issues:** ${projectData.pendingIssues} items need attention
• **Status:** ${completionRate > 80 ? 'On track' : completionRate > 60 ? 'Moderate progress' : 'Needs attention'}

**Key Insights:**
• Team is performing well with ${completionRate}% completion
• Focus needed on resolving ${projectData.pendingIssues} pending issues
• Consider resource reallocation for better efficiency`;
    }
    
    if (input.includes('overload') || input.includes('workload') || input.includes('team')) {
      const overloadedMembers = projectData.teamMembers.filter(member => member.workload > 80);
      return `👥 **Team Workload Analysis:**

**Overloaded Members:**
${overloadedMembers.map(member => 
  `• ${member.name}: ${member.workload}% capacity (${member.currentTasks} tasks)`
).join('\n') || '• No team members currently overloaded'}

**Recommendations:**
• Redistribute tasks from overloaded members
• Consider hiring temporary help for peak workload
• Implement better task prioritization
• Schedule team capacity review meetings

**Action Items:**
• Review task assignments for overloaded members
• Identify tasks that can be delegated or postponed`;
    }
    
    if (input.includes('bug') || input.includes('issue') || input.includes('problem') || input.includes('error')) {
      return `🐛 **Common Bug Solutions:**

**1. Authentication Issues:**
• Clear browser cache and cookies
• Check API token expiration
• Verify user permissions and roles

**2. Data Loading Problems:**
• Check network connectivity
• Verify API endpoints are accessible
• Review database connection status

**3. UI/UX Issues:**
• Test across different browsers
• Check responsive design breakpoints
• Validate form inputs and error handling

**4. Performance Issues:**
• Optimize database queries
• Implement caching strategies
• Review code for memory leaks

**Quick Troubleshooting:**
• Check browser console for errors
• Review server logs for backend issues
• Test with different user accounts`;
    }
    
    if (input.includes('performance') || input.includes('metrics') || input.includes('stats')) {
      return `📈 **Performance Metrics:**

**Team Efficiency:**
• Average task completion: 7.2 tasks/week
• Bug resolution time: 2.3 days average
• Code review turnaround: 1.5 days

**System Performance:**
• Application uptime: 99.8%
• Average response time: 245ms
• Database query optimization: 78%

**Productivity Trends:**
• 15% improvement in sprint velocity
• 23% reduction in bug reports
• 12% faster feature delivery

**Recommendations:**
• Continue current optimization strategies
• Focus on automated testing coverage
• Invest in performance monitoring tools`;
    }
    
    return `I understand you're asking about: "${userInput}"

I can help you with:
• **Project Progress:** Get detailed summaries and completion rates
• **Team Workload:** Identify overloaded team members and suggest redistributions
• **Bug Solutions:** Provide troubleshooting steps and common fixes
• **Performance Analysis:** Show metrics and improvement suggestions

Try asking something like:
• "Summarize our project progress"
• "Who is overloaded on the team?"
• "Suggest solutions for login issues"
• "Show performance metrics"`;
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputValue),
        timestamp: new Date(),
        category: inputValue.toLowerCase().includes('bug') ? 'bug' : 
                 inputValue.toLowerCase().includes('progress') ? 'progress' :
                 inputValue.toLowerCase().includes('overload') ? 'workload' : 'general'
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'bug': return 'bg-red-100 border-red-200';
      case 'progress': return 'bg-blue-100 border-blue-200';
      case 'workload': return 'bg-orange-100 border-orange-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center gap-3">
          <Bot className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">AI Assistant</h1>
            <p className="text-blue-100">Your intelligent office management companion</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 p-4 border-x">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => handleQuickAction(action.action)}
                className="flex items-center gap-2 p-3 bg-white rounded-lg border hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <Icon className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto bg-gray-50 p-4 border-x">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-3xl ${message.type === 'user' ? 'bg-blue-600 text-white' : `${getCategoryColor(message.category)} text-gray-800`} rounded-lg p-4 shadow-sm border`}>
                {message.type === 'ai' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-600">AI Assistant</span>
                  </div>
                )}
                <div className="whitespace-pre-line text-sm leading-relaxed">
                  {message.content}
                </div>
                <div className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-600">AI Assistant</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-sm text-gray-600">Analyzing...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border rounded-b-lg">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me about project progress, team workload, or bug solutions..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
        
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Lightbulb className="w-3 h-3" />
            <span>Pro tip: Try "summarize project progress" or "find who's overloaded"</span>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-green-800">Completed</span>
          </div>
          <div className="text-2xl font-bold text-green-700 mt-1">{projectData.completedTasks}</div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">Total Tasks</span>
          </div>
          <div className="text-2xl font-bold text-blue-700 mt-1">{projectData.totalTasks}</div>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-semibold text-orange-800">Issues</span>
          </div>
          <div className="text-2xl font-bold text-orange-700 mt-1">{projectData.pendingIssues}</div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-semibold text-purple-800">Team Size</span>
          </div>
          <div className="text-2xl font-bold text-purple-700 mt-1">{projectData.teamMembers.length}</div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
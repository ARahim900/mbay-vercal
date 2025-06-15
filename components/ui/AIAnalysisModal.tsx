import React, { useState } from 'react';
import { X, Brain, Sparkles, BarChart3, TrendingUp, DollarSign, Target, Zap, Activity, AlertCircle, CheckCircle, Clock, Lightbulb, Star } from 'lucide-react';

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  data?: any;
  analysisType?: 'electricity' | 'water' | 'stp' | 'contractor';
  customAnalysis?: string;
  isLoading?: boolean;
}

const ANALYSIS_TEMPLATES = {
  electricity: {
    icon: Zap,
    color: '#4E4456',
    sections: [
      { id: 'performance', icon: BarChart3, title: 'Performance Analysis', prefix: '🔋' },
      { id: 'consumption', icon: Activity, title: 'Consumption Breakdown', prefix: '📊' },
      { id: 'forecasting', icon: TrendingUp, title: 'Forecasting & Trends', prefix: '📈' },
      { id: 'insights', icon: Lightbulb, title: 'Key Insights', prefix: '🏗️' },
      { id: 'recommendations', icon: Target, title: 'Strategic Recommendations', prefix: '💡' },
      { id: 'priorities', icon: Star, title: 'Strategic Priorities', prefix: '🎯' }
    ]
  },
  water: {
    icon: Activity,
    color: '#0EA5E9',
    sections: [
      { id: 'flow', icon: Activity, title: 'Water Flow Analysis', prefix: '💧' },
      { id: 'quality', icon: CheckCircle, title: 'Quality Metrics', prefix: '🧪' },
      { id: 'efficiency', icon: Target, title: 'System Efficiency', prefix: '⚡' },
      { id: 'loss', icon: AlertCircle, title: 'Loss Analysis', prefix: '📉' },
      { id: 'optimization', icon: TrendingUp, title: 'Optimization Opportunities', prefix: '💡' }
    ]
  },
  stp: {
    icon: Activity,
    color: '#10B981',
    sections: [
      { id: 'treatment', icon: CheckCircle, title: 'Treatment Performance', prefix: '🔬' },
      { id: 'capacity', icon: BarChart3, title: 'Capacity Analysis', prefix: '📊' },
      { id: 'efficiency', icon: Target, title: 'Process Efficiency', prefix: '⚡' },
      { id: 'environmental', icon: Activity, title: 'Environmental Impact', prefix: '🌍' },
      { id: 'maintenance', icon: Clock, title: 'Maintenance Insights', prefix: '🔧' }
    ]
  },
  contractor: {
    icon: CheckCircle,
    color: '#F59E0B',
    sections: [
      { id: 'performance', icon: BarChart3, title: 'Performance Review', prefix: '📈' },
      { id: 'financial', icon: DollarSign, title: 'Financial Analysis', prefix: '💰' },
      { id: 'timeline', icon: Clock, title: 'Timeline Assessment', prefix: '⏱️' },
      { id: 'risk', icon: AlertCircle, title: 'Risk Analysis', prefix: '⚠️' },
      { id: 'recommendations', icon: Target, title: 'Recommendations', prefix: '💡' }
    ]
  }
};

export const AIAnalysisModal: React.FC<AIAnalysisModalProps> = ({
  isOpen,
  onClose,
  title = "AI Analysis",
  data,
  analysisType = 'electricity',
  customAnalysis,
  isLoading = false
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  if (!isOpen) return null;

  const template = ANALYSIS_TEMPLATES[analysisType];
  const IconComponent = template.icon;

  // Parse analysis content into sections
  const parseAnalysisContent = (content: string) => {
    if (!content) return {};
    
    const sections: Record<string, string[]> = {};
    const lines = content.split('\n');
    let currentSection = '';
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;
      
      // Check if line starts with a section prefix
      const sectionMatch = template.sections.find(section => 
        trimmedLine.startsWith(section.prefix)
      );
      
      if (sectionMatch) {
        currentSection = sectionMatch.id;
        sections[currentSection] = [trimmedLine];
      } else if (currentSection && trimmedLine.startsWith('•')) {
        sections[currentSection] = sections[currentSection] || [];
        sections[currentSection].push(trimmedLine);
      } else if (currentSection) {
        sections[currentSection] = sections[currentSection] || [];
        sections[currentSection].push(trimmedLine);
      }
    });
    
    return sections;
  };

  const analysisContent = parseAnalysisContent(customAnalysis || '');

  const LoadingAnimation = () => (
    <div className="text-center py-12">
      <div className="flex justify-center items-center space-x-4 mb-6">
        <Brain size={48} className="animate-pulse" style={{ color: template.color }} />
        <Sparkles size={48} className="animate-bounce text-yellow-500" />
        <IconComponent size={48} className="animate-pulse" style={{ color: template.color }} />
      </div>
      <h3 className="text-xl font-semibold mb-2" style={{ color: template.color }}>
        AI is analyzing {analysisType} data...
      </h3>
      <p className="text-slate-600 mb-1">Processing patterns, trends, and optimization opportunities</p>
      {data && (
        <p className="text-sm text-slate-500">
          Analyzing {Array.isArray(data) ? data.length : 'comprehensive'} data points across multiple dimensions
        </p>
      )}
      <div className="mt-6 w-64 mx-auto bg-slate-200 rounded-full h-3 overflow-hidden">
        <div 
          className="h-full rounded-full animate-pulse transition-all duration-1000"
          style={{ 
            background: `linear-gradient(90deg, ${template.color}, ${template.color}80)`,
            width: '75%'
          }}
        />
      </div>
    </div>
  );

  const SectionContent = ({ sectionId, lines }: { sectionId: string, lines: string[] }) => {
    const section = template.sections.find(s => s.id === sectionId);
    if (!section || !lines) return null;

    return (
      <div className="mb-6">
        <button
          onClick={() => setExpandedSection(expandedSection === sectionId ? null : sectionId)}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg text-white" 
              style={{ backgroundColor: template.color }}
            >
              <section.icon size={20} />
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-slate-800">{section.title}</h4>
              <p className="text-sm text-slate-500">{lines.length} insights available</p>
            </div>
          </div>
          <div 
            className={`transform transition-transform duration-200 ${
              expandedSection === sectionId ? 'rotate-180' : ''
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-slate-400">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </button>
        
        {expandedSection === sectionId && (
          <div className="mt-3 p-4 bg-white rounded-lg border border-slate-200 animate-slideDown">
            <div className="space-y-2">
              {lines.map((line, index) => {
                if (line.startsWith(section.prefix)) {
                  return (
                    <h5 key={index} className="font-bold text-lg mb-3" style={{ color: template.color }}>
                      {line}
                    </h5>
                  );
                }
                if (line.startsWith('•')) {
                  return (
                    <div key={index} className="flex items-start gap-2 py-1">
                      <div 
                        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: template.color }}
                      />
                      <p className="text-slate-700 text-sm leading-relaxed">{line.substring(1).trim()}</p>
                    </div>
                  );
                }
                return (
                  <p key={index} className="text-slate-700 text-sm leading-relaxed">
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div 
          className="p-6 text-white relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${template.color}, ${template.color}CC)` 
          }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 -translate-x-16 -translate-y-16">
              <IconComponent size={128} />
            </div>
            <div className="absolute bottom-0 right-0 w-24 h-24 translate-x-12 translate-y-12">
              <Brain size={96} />
            </div>
          </div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Brain size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="text-white/90 text-sm">
                  Advanced AI insights for {analysisType} management
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
            >
              <X size={24} className="text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <LoadingAnimation />
          ) : customAnalysis ? (
            <div className="space-y-4">
              {/* Analysis Summary */}
              <div className="bg-gradient-to-r from-slate-50 to-white p-4 rounded-lg border border-slate-200 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="text-yellow-500" size={20} />
                  <h3 className="font-semibold text-slate-800">Analysis Summary</h3>
                </div>
                <p className="text-sm text-slate-600">
                  AI has analyzed your {analysisType} data and identified {Object.keys(analysisContent).length} key areas 
                  with actionable insights and strategic recommendations.
                </p>
              </div>

              {/* Expandable Sections */}
              <div className="space-y-3">
                {template.sections.map(section => {
                  const sectionContent = analysisContent[section.id];
                  if (!sectionContent || sectionContent.length === 0) return null;
                  
                  return (
                    <SectionContent 
                      key={section.id}
                      sectionId={section.id}
                      lines={sectionContent}
                    />
                  );
                })}
              </div>

              {/* Fallback for unstructured content */}
              {Object.keys(analysisContent).length === 0 && (
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <div className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">
                    {customAnalysis}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle size={64} className="text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No Analysis Available</h3>
              <p className="text-slate-500">
                Unable to generate analysis at this time. Please try again or check your data.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Brain size={16} />
              <span>Powered by Advanced AI Analytics</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Close
              </button>
              <button
                className="px-6 py-2 rounded-lg text-white font-medium transition-all transform hover:scale-105"
                style={{ backgroundColor: template.color }}
                onClick={() => {
                  // Future: Export functionality
                  console.log('Export analysis functionality');
                }}
              >
                Export Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisModal;
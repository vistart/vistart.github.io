import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer, Area, AreaChart } from 'recharts';

const DebtRiskAnalysis = () => {
  const [scenario, setScenario] = useState('conservative');
  const [showRiskEvent, setShowRiskEvent] = useState(false);

  // 基准贡献曲线(中国)
  const generateBaseContribution = () => {
    const data = [];
    for (let age = 22; age <= 65; age++) {
      let contribution = 0;
      if (age < 25) {
        contribution = -30 + (age - 22) * 25;
      } else if (age < 30) {
        contribution = 45 + (age - 25) * 3;
      } else if (age < 50) {
        const basePeak = 60 + (age - 30) * 0.5;
        const familySupport = age > 35 ? -8 : 0;
        contribution = basePeak + familySupport;
      } else if (age < 60) {
        contribution = 70 - (age - 50) * 2 - 10;
      } else {
        contribution = 40 - (age - 60) * 8;
      }
      data.push({ age, base: contribution });
    }
    return data;
  };

  // 场景1: 保守策略 - 28岁购房,首付50%,贷款15年
  const conservativeScenario = (baseData) => {
    return baseData.map(item => {
      const age = item.age;
      let debtBurden = 0;
      let available = item.base;
      let risk = 10; // 基础风险
      
      if (age >= 28 && age < 43) {
        debtBurden = -15; // 月供负担
        risk = 20;
      }
      
      available = item.base + debtBurden;
      
      return {
        ...item,
        available,
        debtBurden,
        risk,
        riskUpper: available + risk,
        riskLower: available - risk
      };
    });
  };

  // 场景2: 激进策略 - 22岁购房,首付30%,贷款30年
  const aggressiveScenario = (baseData) => {
    return baseData.map(item => {
      const age = item.age;
      let debtBurden = 0;
      let available = item.base;
      let risk = 10;
      
      if (age >= 22 && age < 52) {
        // 前期月供压力大
        if (age < 30) {
          debtBurden = -35; // 收入低但月供固定
        } else if (age < 40) {
          debtBurden = -25;
        } else {
          debtBurden = -20;
        }
        risk = age < 30 ? 40 : (age < 40 ? 35 : 30);
      }
      
      available = item.base + debtBurden;
      
      return {
        ...item,
        available,
        debtBurden,
        risk,
        riskUpper: available + risk,
        riskLower: available - risk
      };
    });
  };

  // 场景3: 平衡策略 - 25岁购房,首付40%,贷款25年
  const balancedScenario = (baseData) => {
    return baseData.map(item => {
      const age = item.age;
      let debtBurden = 0;
      let available = item.base;
      let risk = 10;
      
      if (age >= 25 && age < 50) {
        if (age < 30) {
          debtBurden = -22;
        } else if (age < 45) {
          debtBurden = -18;
        } else {
          debtBurden = -15;
        }
        risk = age < 30 ? 28 : (age < 40 ? 25 : 22);
      }
      
      available = item.base + debtBurden;
      
      return {
        ...item,
        available,
        debtBurden,
        risk,
        riskUpper: available + risk,
        riskLower: available - risk
      };
    });
  };

  // 意外事件模拟(35岁失业/疾病)
  const applyRiskEvent = (data) => {
    return data.map(item => {
      if (item.age >= 35 && item.age < 37) {
        return {
          ...item,
          available: item.available - 40,
          risk: item.risk + 20,
          riskUpper: item.available - 40 + item.risk + 20,
          riskLower: item.available - 40 - item.risk - 20
        };
      }
      return item;
    });
  };

  const baseData = generateBaseContribution();
  let scenarioData;
  
  switch(scenario) {
    case 'conservative':
      scenarioData = conservativeScenario(baseData);
      break;
    case 'aggressive':
      scenarioData = aggressiveScenario(baseData);
      break;
    case 'balanced':
      scenarioData = balancedScenario(baseData);
      break;
    default:
      scenarioData = baseData;
  }

  if (showRiskEvent) {
    scenarioData = applyRiskEvent(scenarioData);
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold mb-2">{`年龄: ${label}岁`}</p>
          <p className="text-blue-600">基准贡献: {data.base?.toFixed(1)}</p>
          <p className="text-red-600">负债负担: {data.debtBurden?.toFixed(1)}</p>
          <p className="text-green-600 font-semibold">可支配贡献: {data.available?.toFixed(1)}</p>
          <p className="text-orange-600">风险系数: ±{data.risk?.toFixed(1)}</p>
        </div>
      );
    }
    return null;
  };

  const scenarios = {
    conservative: {
      name: "保守策略",
      color: "green",
      details: {
        buyAge: "28岁",
        downPayment: "50%",
        loanYears: "15年",
        monthlyPayment: "月供占比25%",
        riskLevel: "低",
        advantage: "风险敞口小,财务灵活性高",
        disadvantage: "晚享受住房,可能错过房价上涨"
      }
    },
    aggressive: {
      name: "激进策略",
      color: "red",
      details: {
        buyAge: "22岁",
        downPayment: "30%",
        loanYears: "30年",
        monthlyPayment: "月供占比50%+",
        riskLevel: "高",
        advantage: "尽早拥有资产,享受增值",
        disadvantage: "前期压力巨大,抗风险能力弱"
      }
    },
    balanced: {
      name: "平衡策略",
      color: "blue",
      details: {
        buyAge: "25岁",
        downPayment: "40%",
        loanYears: "25年",
        monthlyPayment: "月供占比35%",
        riskLevel: "中",
        advantage: "兼顾资产积累与风险控制",
        disadvantage: "需要一定储蓄,时机把握重要"
      }
    }
  };

  const currentScenario = scenarios[scenario];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2">购房负债决策与风险敞口分析</h1>
      <p className="text-center text-gray-600 mb-6">基于社会贡献曲线的劳动力变现与风险管理</p>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex gap-4 mb-4 flex-wrap">
          <button
            onClick={() => setScenario('conservative')}
            className={`px-4 py-2 rounded font-semibold ${scenario === 'conservative' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            保守策略
          </button>
          <button
            onClick={() => setScenario('balanced')}
            className={`px-4 py-2 rounded font-semibold ${scenario === 'balanced' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            平衡策略
          </button>
          <button
            onClick={() => setScenario('aggressive')}
            className={`px-4 py-2 rounded font-semibold ${scenario === 'aggressive' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          >
            激进策略
          </button>
          <button
            onClick={() => setShowRiskEvent(!showRiskEvent)}
            className={`px-4 py-2 rounded font-semibold ml-auto ${showRiskEvent ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
          >
            {showRiskEvent ? '隐藏' : '模拟'}风险事件(35岁)
          </button>
        </div>

        <ResponsiveContainer width="100%" height={450}>
          <AreaChart data={scenarioData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="age" 
              label={{ value: '年龄(岁)', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: '社会贡献度/可支配能力', angle: -90, position: 'insideLeft' }}
              domain={[-80, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
            
            {/* 风险敞口阴影区域 */}
            <Area
              type="monotone"
              dataKey="riskUpper"
              stackId="1"
              stroke="none"
              fill="#fecaca"
              fillOpacity={0.3}
              name="风险上限"
            />
            <Area
              type="monotone"
              dataKey="riskLower"
              stackId="2"
              stroke="none"
              fill="#fecaca"
              fillOpacity={0.3}
              name="风险下限"
            />
            
            {/* 基准贡献曲线 */}
            <Line 
              type="monotone" 
              dataKey="base" 
              stroke="#94a3b8" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="基准贡献(无负债)"
              dot={false}
            />
            
            {/* 实际可支配曲线 */}
            <Line 
              type="monotone" 
              dataKey="available" 
              stroke={currentScenario.color === 'green' ? '#22c55e' : currentScenario.color === 'blue' ? '#3b82f6' : '#ef4444'}
              strokeWidth={3}
              name="实际可支配"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className={`bg-${currentScenario.color}-50 rounded-lg p-6 mb-6 border-l-4 border-${currentScenario.color}-500`}>
        <h2 className="text-2xl font-bold mb-4" style={{color: currentScenario.color === 'green' ? '#16a34a' : currentScenario.color === 'blue' ? '#2563eb' : '#dc2626'}}>
          当前选择: {currentScenario.name}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded p-4">
            <h3 className="font-semibold mb-3 text-gray-800">策略参数</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">购房年龄:</span>
                <span className="font-semibold">{currentScenario.details.buyAge}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">首付比例:</span>
                <span className="font-semibold">{currentScenario.details.downPayment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">贷款年限:</span>
                <span className="font-semibold">{currentScenario.details.loanYears}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">月供压力:</span>
                <span className="font-semibold">{currentScenario.details.monthlyPayment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">风险等级:</span>
                <span className={`font-semibold ${currentScenario.details.riskLevel === '高' ? 'text-red-600' : currentScenario.details.riskLevel === '中' ? 'text-orange-600' : 'text-green-600'}`}>
                  {currentScenario.details.riskLevel}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded p-4">
            <h3 className="font-semibold mb-3 text-gray-800">利弊分析</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-green-600 font-semibold mb-1">✓ 优势:</div>
                <div className="text-gray-700">{currentScenario.details.advantage}</div>
              </div>
              <div>
                <div className="text-red-600 font-semibold mb-1">✗ 劣势:</div>
                <div className="text-gray-700">{currentScenario.details.disadvantage}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-xl font-bold mb-4 text-gray-800">核心策略原则</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start">
              <span className="text-blue-500 mr-2 text-lg">1.</span>
              <div>
                <div className="font-semibold">收入稳定性评估</div>
                <div className="text-gray-600">选择负债水平前,评估行业前景、职业发展路径</div>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-blue-500 mr-2 text-lg">2.</span>
              <div>
                <div className="font-semibold">保持流动性储备</div>
                <div className="text-gray-600">至少保留6-12个月月供的应急资金</div>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-blue-500 mr-2 text-lg">3.</span>
              <div>
                <div className="font-semibold">月供占比控制</div>
                <div className="text-gray-600">建议不超过家庭收入的40%,预留生活质量空间</div>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-blue-500 mr-2 text-lg">4.</span>
              <div>
                <div className="font-semibold">考虑贡献曲线变化</div>
                <div className="text-gray-600">35-50岁需支持子女,45岁后收入增速放缓</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-xl font-bold mb-4 text-gray-800">风险应对措施</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start">
              <span className="text-orange-500 mr-2 text-lg">1.</span>
              <div>
                <div className="font-semibold">收入多元化</div>
                <div className="text-gray-600">培养副业能力,不把所有鸡蛋放在一个篮子</div>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-orange-500 mr-2 text-lg">2.</span>
              <div>
                <div className="font-semibold">购买保险保障</div>
                <div className="text-gray-600">重疾险、定期寿险覆盖贷款余额</div>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-orange-500 mr-2 text-lg">3.</span>
              <div>
                <div className="font-semibold">持续技能提升</div>
                <div className="text-gray-600">保持竞争力,延缓贡献曲线下降速度</div>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-orange-500 mr-2 text-lg">4.</span>
              <div>
                <div className="font-semibold">灵活调整策略</div>
                <div className="text-gray-600">根据实际情况考虑提前还贷或延长贷款</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 rounded-lg p-5 border-l-4 border-yellow-500">
        <h3 className="text-lg font-bold mb-3 text-yellow-800">⚠️ 关键洞察</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>贡献透支本质:</strong> 购房贷款实质上是将未来20-30年的社会贡献提前变现。你在用未来的劳动力抵押当前的资产。</p>
          <p><strong>风险敞口:</strong> 图中阴影区域代表各种不确定性(失业、疾病、行业变迁)。负债越重,阴影区域越大,一旦"黑天鹅"发生,可支配贡献可能跌破零线。</p>
          <p><strong>最优决策时机:</strong> 理想购房时机是收入开始快速上升且相对稳定时(25-28岁),既不会错过太多资产增值,也有一定风险承受能力。</p>
          <p><strong>35岁危机:</strong> 这个年龄段往往面临"上有老下有小"的压力,同时职业发展可能遇到瓶颈,是最需要财务灵活性的时期。</p>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        提示: 点击"模拟风险事件"查看35岁遭遇失业或重大疾病时各策略的脆弱性
      </div>
    </div>
  );
};

export default DebtRiskAnalysis;

export const meta = {
  title: '购房负债决策与风险敞口分析',
  date: '2025-12-30',
  summary: '基于社会贡献曲线的劳动力变现与风险管理'
};
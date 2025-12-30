import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';

const ContributionChart = () => {
  const [showDetails, setShowDetails] = useState(null);

  // 生成中国数据
  const generateChinaData = () => {
    const data = [];
    for (let age = 0; age <= 78; age++) {
      let contribution = 0;
      
      if (age < 6) {
        // 学龄前
        contribution = -25 - age * 2;
      } else if (age < 22) {
        // 受教育阶段 (公立教育,政府投入大)
        contribution = -35 - (age - 6) * 1.5;
      } else if (age < 25) {
        // 刚工作,快速上升
        contribution = -30 + (age - 22) * 25;
      } else if (age < 30) {
        // 婚育年龄,对子女支持开始
        contribution = 45 + (age - 25) * 3;
      } else if (age < 50) {
        // 壮年期高峰,但要支持子女买房等
        const basePeak = 60 + (age - 30) * 0.5;
        const familySupport = age > 35 ? -8 : 0; // 35岁后开始支持子女
        contribution = basePeak + familySupport;
      } else if (age < 60) {
        // 后期,继续支持子女
        contribution = 70 - (age - 50) * 2 - 10;
      } else if (age < 65) {
        // 退休前后过渡期
        contribution = 40 - (age - 60) * 8;
      } else {
        // 退休期 (私企退休金低,社会负担重)
        contribution = 0 - (age - 65) * 2.5;
      }
      
      data.push({ age, china: Math.round(contribution * 10) / 10 });
    }
    return data;
  };

  // 生成美国数据
  const generateUSData = () => {
    const data = [];
    for (let age = 0; age <= 79; age++) {
      let contribution = 0;
      
      if (age < 6) {
        // 学龄前
        contribution = -20 - age * 1.5;
      } else if (age < 22) {
        // 受教育阶段 (私立比例高,家庭负担大,政府投入相对小)
        contribution = -15 - (age - 6) * 0.8;
      } else if (age < 26) {
        // 刚工作,但可能有学贷
        contribution = -10 + (age - 22) * 15;
      } else if (age < 35) {
        // 快速上升期
        contribution = 50 + (age - 26) * 3;
      } else if (age < 55) {
        // 壮年期高峰 (无国企利润上缴,税负相对纯粹)
        contribution = 77 + (age - 35) * 0.15;
      } else if (age < 65) {
        // 后期
        contribution = 80 - (age - 55) * 2;
      } else if (age < 70) {
        // 退休初期 (401k自理,社会负担小)
        contribution = 60 - (age - 65) * 6;
      } else {
        // 老年期 (医疗支出高)
        contribution = 30 - (age - 70) * 4;
      }
      
      data.push({ age, us: Math.round(contribution * 10) / 10 });
    }
    return data;
  };

  // 合并数据
  const chinaData = generateChinaData();
  const usData = generateUSData();
  const mergedData = chinaData.map((item, index) => ({
    ...item,
    ...usData[index]
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold mb-1">{`年龄: ${label}岁`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const stageInfo = {
    china: [
      { range: "0-22岁", desc: "受教育期，公立教育主导，政府投入大，个人负担小", value: "-35至-55" },
      { range: "22-30岁", desc: "快速上升期，进入劳动市场", value: "-30至+60" },
      { range: "30-50岁", desc: "高峰期，但需支持子女(购房等)，国企员工税负更重", value: "+50至+70" },
      { range: "50-65岁", desc: "继续工作，持续支持子女新家庭", value: "+30至+60" },
      { range: "65岁+", desc: "退休期，私企退休金低，社会负担重", value: "0至-35" }
    ],
    us: [
      { range: "0-22岁", desc: "受教育期，私立教育比例高，家庭自付多，政府投入相对小", value: "-15至-30" },
      { range: "22-35岁", desc: "快速上升期，可能背负学贷", value: "-10至+77" },
      { range: "35-55岁", desc: "高峰期，无国企利润上缴制度", value: "+77至+80" },
      { range: "55-70岁", desc: "后期及退休初期，401k自理", value: "+20至+60" },
      { range: "70岁+", desc: "老年期，医疗支出高", value: "+30至-10" }
    ]
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2">中美社会贡献度对比曲线</h1>
      <p className="text-center text-gray-600 mb-6">基于本科学历劳动力的生命周期分析</p>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={mergedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="age" 
              label={{ value: '年龄(岁)', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: '社会贡献度', angle: -90, position: 'insideLeft' }}
              domain={[-60, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
            <Line 
              type="monotone" 
              dataKey="china" 
              stroke="#ef4444" 
              strokeWidth={2.5}
              name="中国"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="us" 
              stroke="#3b82f6" 
              strokeWidth={2.5}
              name="美国"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-500">
          <h2 className="text-xl font-bold text-red-700 mb-3 flex items-center">
            <span className="mr-2">🇨🇳</span> 中国曲线特征
          </h2>
          <div className="space-y-3">
            {stageInfo.china.map((stage, idx) => (
              <div key={idx} className="bg-white rounded p-3">
                <div className="font-semibold text-red-800">{stage.range}</div>
                <div className="text-sm text-gray-700 mt-1">{stage.desc}</div>
                <div className="text-xs text-red-600 mt-1">贡献度范围: {stage.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-5 border-l-4 border-blue-500">
          <h2 className="text-xl font-bold text-blue-700 mb-3 flex items-center">
            <span className="mr-2">🇺🇸</span> 美国曲线特征
          </h2>
          <div className="space-y-3">
            {stageInfo.us.map((stage, idx) => (
              <div key={idx} className="bg-white rounded p-3">
                <div className="font-semibold text-blue-800">{stage.range}</div>
                <div className="text-sm text-gray-700 mt-1">{stage.desc}</div>
                <div className="text-xs text-blue-600 mt-1">贡献度范围: {stage.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-5">
        <h3 className="text-lg font-bold mb-3">核心差异总结</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-red-700 mb-2">中国特点:</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• 教育期负值更大(公立教育政府投入高)</li>
              <li>• 壮年期有"家庭支持"负担(支持子女购房等)</li>
              <li>• 国企员工实际税负更重(利润上缴)</li>
              <li>• 退休期私企员工社会负担更重</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">美国特点:</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• 教育期负值较小(家庭自付多,政府投入少)</li>
              <li>• 壮年期峰值更高更持久(无国企利润上缴)</li>
              <li>• 无代际购房支持负担</li>
              <li>• 退休期401k自理,社会负担小</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        注: 本图表为理论模型,仅用于说明结构性差异,不代表精确数值
      </div>
    </div>
  );
};

export default ContributionChart;

export const meta = {
  title: '中美社会贡献度对比曲线',
  date: '2025-12-30',
  summary: '基于本科学历劳动力的生命周期分析'
};
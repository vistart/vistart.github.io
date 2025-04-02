<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  ElCard,
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElButton,
  ElDivider,
  ElRadioGroup,
  ElRadio,
  ElAlert,
  ElTooltip,
  ElIcon,
} from 'element-plus';
import { InfoFilled, Money } from '@element-plus/icons-vue';

const { t } = useI18n();

// 计算方法
enum CalculationMethod {
  FEE_RATE = 'feeRate',
  FEE_PER_PERIOD = 'feePerPeriod', // 按每期手续费计算（包含前几期和后几期不同手续费的情况）
}

// 表单数据
const form = reactive({
  principal: 10000, // 本金
  periods: 12, // 分期期数
  feeRate: 3, // 手续费率（百分比）
  calculationMethod: CalculationMethod.FEE_RATE, // 计算方法
  frontPeriods: 8, // 前几期
  frontFee: 0, // 前几期手续费
  backFee: 0, // 后几期手续费
});

// 可选分期期数
const periodOptions = [3, 6, 12, 18, 24, 36, 48, 60];

// 表单验证规则
const rules = {
  principal: [
    { required: true, message: () => t('tools.creditCardApr.inputPrincipal'), trigger: 'blur' },
    { type: 'number', min: 1, message: () => t('tools.creditCardApr.inputPrincipal'), trigger: 'blur' },
  ],
  periods: [
    { required: true, message: () => t('tools.creditCardApr.inputPeriods'), trigger: 'change' },
  ],
  feeRate: [
    { required: true, message: () => t('tools.creditCardApr.inputFeeRate'), trigger: 'blur' },
    { type: 'number', min: 0, message: () => t('tools.creditCardApr.inputFeeRate'), trigger: 'blur' },
  ],
};

// 计算结果
const result = ref({
  totalFee: 0,
  monthlyPayment: 0,
  apr: 0,
  principalPerPeriod: 0,
  feePerPeriod: 0,
  lastPeriodFee: 0, // 最后一期手续费（仅在每期手续费计算方法时可能不同）
});

// 是否显示结果
const showResult = ref(false);

// 计算总手续费
const calculateTotalFee = computed(() => {
  if (form.calculationMethod === CalculationMethod.FEE_RATE) {
    return form.principal * (form.feeRate / 100);
  } else if (form.calculationMethod === CalculationMethod.FEE_PER_PERIOD) {
    if (form.frontPeriods > 0 && form.frontPeriods < form.periods) {
      const frontPeriodsTotal = form.frontPeriods * form.frontFee;
      const backPeriodsTotal = (form.periods - form.frontPeriods) * form.backFee;
      return frontPeriodsTotal + backPeriodsTotal;
    }
  }
  return 0;
});


// 计算每期本金
const calculatePrincipalPerPeriod = computed(() => {
  return form.principal / form.periods;
});

// 计算每期手续费（前几期）
const calculateFeePerPeriod = computed(() => {
  if (form.calculationMethod === CalculationMethod.FEE_RATE) {
    return (form.principal * (form.feeRate / 100)) / form.periods;
  } else if (form.calculationMethod === CalculationMethod.FEE_PER_PERIOD) {
    return form.frontFee;
  }
  return 0;
});

// 计算后几期手续费
const calculateBackPeriodFee = computed(() => {
  if (form.calculationMethod === CalculationMethod.FEE_PER_PERIOD) {
    return form.backFee;
  }
  return calculateFeePerPeriod.value;
});

// 计算最后一期手续费
const calculateLastPeriodFee = computed(() => {
  if (form.calculationMethod === CalculationMethod.FEE_PER_PERIOD) {
    return form.backFee;
  }
  return calculateFeePerPeriod.value;
});

// 计算每月还款额（前几期）
const calculateFrontMonthlyPayment = computed(() => {
  const principalPerPeriod = calculatePrincipalPerPeriod.value;
  const feePerPeriod = calculateFeePerPeriod.value;
  return principalPerPeriod + feePerPeriod;
});

// 计算每月还款额（后几期）
const calculateBackMonthlyPayment = computed(() => {
  const principalPerPeriod = calculatePrincipalPerPeriod.value;
  const backFee = calculateBackPeriodFee.value;
  return principalPerPeriod + backFee;
});

// 计算平均每月还款额
const calculateMonthlyPayment = computed(() => {
  if (form.calculationMethod === CalculationMethod.FEE_PER_PERIOD) {
    const frontTotal = calculateFrontMonthlyPayment.value * form.frontPeriods;
    const backTotal = calculateBackMonthlyPayment.value * (form.periods - form.frontPeriods);
    return (frontTotal + backTotal) / form.periods;
  }
  return calculateFrontMonthlyPayment.value;
});

// 计算年化利率 (APR) 使用内部收益率 (IRR) 方法
const calculateAPR = () => {
  const principalPerPeriod = calculatePrincipalPerPeriod.value;
  const feePerPeriod = calculateFeePerPeriod.value;
  const backPeriodFee = calculateBackPeriodFee.value;
  const periods = form.periods;
  
  // 初始现金流为本金（负值表示支出）
  const cashFlows = [-form.principal];
  
  // 每期还款（正值表示收入）
  if (form.calculationMethod === CalculationMethod.FEE_PER_PERIOD) {
    // 前几期还款
    for (let i = 0; i < form.frontPeriods; i++) {
      cashFlows.push(principalPerPeriod + feePerPeriod);
    }
    
    // 后几期还款
    for (let i = form.frontPeriods; i < periods; i++) {
      cashFlows.push(principalPerPeriod + backPeriodFee);
    }
  } else {
    // 每期还款（正值表示收入）
    for (let i = 0; i < periods - 1; i++) {
      cashFlows.push(principalPerPeriod + feePerPeriod);
    }
    
    // 最后一期还款可能不同
    cashFlows.push(principalPerPeriod + calculateLastPeriodFee.value);
  }
  
  // 使用牛顿迭代法计算内部收益率
  const irr = calculateIRR(cashFlows);
  
  // 将月利率转换为年化利率
  return irr * 12 * 100;
};

// 计算内部收益率 (IRR) 的辅助函数
const calculateIRR = (cashFlows: number[], guess = 0.1, maxIterations = 100, tolerance = 1e-7) => {
  let rate = guess;
  
  for (let i = 0; i < maxIterations; i++) {
    const npv = calculateNPV(cashFlows, rate);
    const derivative = calculateNPVDerivative(cashFlows, rate);
    
    if (Math.abs(derivative) < tolerance) {
      break;
    }
    
    const newRate = rate - npv / derivative;
    
    if (Math.abs(newRate - rate) < tolerance) {
      rate = newRate;
      break;
    }
    
    rate = newRate;
  }
  
  return rate;
};

// 计算净现值 (NPV) 的辅助函数
const calculateNPV = (cashFlows: number[], rate: number) => {
  return cashFlows.reduce((npv, cf, t) => npv + cf / Math.pow(1 + rate, t), 0);
};

// 计算净现值导数的辅助函数
const calculateNPVDerivative = (cashFlows: number[], rate: number) => {
  return cashFlows.reduce((derivative, cf, t) => {
    return t === 0 ? derivative : derivative - (t * cf) / Math.pow(1 + rate, t + 1);
  }, 0);
};

// 执行计算
const calculate = () => {
  // 不需要更新每期手续费，直接使用计算值
  
  // 计算结果
  result.value = {
    totalFee: calculateTotalFee.value,
    monthlyPayment: calculateMonthlyPayment.value,
    apr: calculateAPR(),
    principalPerPeriod: calculatePrincipalPerPeriod.value,
    feePerPeriod: calculateFeePerPeriod.value,
    lastPeriodFee: calculateLastPeriodFee.value,
  };
  
  showResult.value = true;
};

// 验证前几期数量
const validateFrontPeriods = computed(() => {
  return form.calculationMethod === CalculationMethod.FEE_PER_PERIOD ? (form.frontPeriods > 0 && form.frontPeriods < form.periods) : true;
});

// 重置表单
const resetForm = () => {
  form.principal = 10000;
  form.periods = 12;
  form.feeRate = 3;
  form.frontPeriods = 8;
  form.frontFee = 0;
  form.backFee = 0;
  form.calculationMethod = CalculationMethod.FEE_RATE;
  showResult.value = false;
};

// 切换计算方法
const handleMethodChange = () => {
  if (form.calculationMethod === CalculationMethod.FEE_RATE) {
    // 如果切换到费率计算，重置前几期和后几期手续费
    form.frontFee = 0;
    form.backFee = 0;
  } else if (form.calculationMethod === CalculationMethod.FEE_PER_PERIOD) {
    // 如果切换到每期手续费计算，重置费率
    form.feeRate = 0;
  }
  showResult.value = false;
};
</script>

<template>
  <div class="credit-card-apr-calculator">
    <el-card class="calculator-card">
      <template #header>
        <div class="card-header">
          <el-icon><Money /></el-icon>
          <span>{{ t('tools.creditCardApr.name') }}</span>
        </div>
      </template>
      
      <el-form :model="form" label-position="top">
        <!-- 计算方法选择 -->
        <el-form-item :label="t('tools.creditCardApr.calculationMethod')">
          <el-radio-group v-model="form.calculationMethod" @change="handleMethodChange">
            <el-radio :label="CalculationMethod.FEE_RATE">{{ t('tools.creditCardApr.feeRateMethod') }}</el-radio>
            <el-radio :label="CalculationMethod.FEE_PER_PERIOD">{{ t('tools.creditCardApr.feePerPeriodMethod') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <!-- 本金输入 -->
        <el-form-item :label="t('tools.creditCardApr.principal')">
          <el-input
            v-model.number="form.principal"
            type="number"
            :placeholder="t('tools.creditCardApr.inputPrincipal')"
          >
            <template #prefix>
              <span>{{ t('tools.creditCardApr.currency') }}</span>
            </template>
          </el-input>
        </el-form-item>
        
        <!-- 分期期数选择 -->
        <el-form-item :label="t('tools.creditCardApr.periods')">
          <el-select v-model="form.periods" style="width: 100%">
            <el-option
              v-for="period in periodOptions"
              :key="period"
              :label="`${period} ${t('tools.creditCardApr.periodUnit')}`"
              :value="period"
            />
          </el-select>
        </el-form-item>
        
        <!-- 费率输入 (仅在费率计算方法时显示) -->
        <el-form-item 
          v-if="form.calculationMethod === CalculationMethod.FEE_RATE"
          :label="t('tools.creditCardApr.feeRate')"
        >
          <el-input
            v-model.number="form.feeRate"
            type="number"
            :placeholder="t('tools.creditCardApr.inputFeeRate')"
          >
            <template #suffix>
              <span>{{ t('tools.creditCardApr.rateUnit') }}</span>
            </template>
          </el-input>
        </el-form-item>
        
        <!-- 不同期数不同手续费输入 (仅在每期手续费计算方法时显示) -->
        <template v-if="form.calculationMethod === CalculationMethod.FEE_PER_PERIOD">
          
          <!-- 不同期数不同手续费输入选项 -->
          <el-form-item :label="t('tools.creditCardApr.frontPeriods') || '前几期数量'">
            <el-input
              v-model.number="form.frontPeriods"
              type="number"
              :placeholder="t('tools.creditCardApr.inputFrontPeriods') || '请输入前几期数量'"
            >
              <template #suffix>
                <span>{{ t('tools.creditCardApr.periodUnit') }}</span>
              </template>
            </el-input>
            <div v-if="!validateFrontPeriods" style="color: #F56C6C; font-size: 12px; margin-top: 5px;">
              {{ t('tools.creditCardApr.frontPeriodsError') || '前几期数量必须大于0且小于总期数' }}
            </div>
          </el-form-item>
          
          <el-form-item :label="t('tools.creditCardApr.frontFee') || '前几期手续费'">
            <el-input
              v-model.number="form.frontFee"
              type="number"
              :placeholder="t('tools.creditCardApr.inputFrontFee') || '请输入前几期手续费'"
            >
              <template #prefix>
                <span>{{ t('tools.creditCardApr.currency') }}</span>
              </template>
            </el-input>
          </el-form-item>
          
          <el-form-item :label="t('tools.creditCardApr.backFee') || '后几期手续费'">
            <el-input
              v-model.number="form.backFee"
              type="number"
              :placeholder="t('tools.creditCardApr.inputBackFee') || '请输入后几期手续费'"
            >
              <template #prefix>
                <span>{{ t('tools.creditCardApr.currency') }}</span>
              </template>
            </el-input>
          </el-form-item>
        </template>
        
        <!-- 操作按钮 -->
        <div class="form-actions">
          <el-button type="primary" @click="calculate">{{ t('common.calculate') }}</el-button>
          <el-button @click="resetForm">{{ t('common.reset') }}</el-button>
        </div>
      </el-form>
      
      <!-- 计算结果 -->
      <div v-if="showResult" class="calculation-result">
        <el-divider>{{ t('common.result') }}</el-divider>
        
        <div class="result-item">
          <span class="result-label">{{ t('tools.creditCardApr.totalFee') }}:</span>
          <span class="result-value">{{ t('tools.creditCardApr.currency') }} {{ result.totalFee.toFixed(2) }}</span>
        </div>
        
        <div class="result-item">
          <span class="result-label">{{ t('tools.creditCardApr.principalPerPeriod') }}:</span>
          <span class="result-value">{{ t('tools.creditCardApr.currency') }} {{ result.principalPerPeriod.toFixed(2) }}</span>
        </div>
        
        <template v-if="form.calculationMethod === CalculationMethod.FEE_PER_PERIOD">
          <div class="result-item">
            <span class="result-label">{{ t('tools.creditCardApr.frontFee') || '前几期手续费' }}:</span>
            <span class="result-value">{{ t('tools.creditCardApr.currency') }} {{ result.feePerPeriod.toFixed(2) }}</span>
          </div>
          
          <div class="result-item">
            <span class="result-label">{{ t('tools.creditCardApr.backFee') || '后几期手续费' }}:</span>
            <span class="result-value">{{ t('tools.creditCardApr.currency') }} {{ result.lastPeriodFee.toFixed(2) }}</span>
          </div>
          
          <div class="result-item">
            <span class="result-label">{{ t('tools.creditCardApr.frontMonthlyPayment') || '前几期月供' }}:</span>
            <span class="result-value">{{ t('tools.creditCardApr.currency') }} {{ calculateFrontMonthlyPayment.toFixed(2) }}</span>
          </div>
          
          <div class="result-item">
            <span class="result-label">{{ t('tools.creditCardApr.backMonthlyPayment') || '后几期月供' }}:</span>
            <span class="result-value">{{ t('tools.creditCardApr.currency') }} {{ calculateBackMonthlyPayment.toFixed(2) }}</span>
          </div>
        </template>
        
        <template v-else>
          <div class="result-item">
            <span class="result-label">{{ t('tools.creditCardApr.feePerPeriod') }}:</span>
            <span class="result-value">{{ t('tools.creditCardApr.currency') }} {{ result.feePerPeriod.toFixed(2) }}</span>
          </div>
          
          <div class="result-item" v-if="result.lastPeriodFee !== result.feePerPeriod">
            <span class="result-label">{{ t('tools.creditCardApr.lastPeriodFee') }}:</span>
            <span class="result-value">{{ t('tools.creditCardApr.currency') }} {{ result.lastPeriodFee.toFixed(2) }}</span>
          </div>
        </template>
        
        <div class="result-item">
          <span class="result-label">{{ t('tools.creditCardApr.monthlyPayment') }}:</span>
          <span class="result-value">{{ t('tools.creditCardApr.currency') }} {{ result.monthlyPayment.toFixed(2) }}</span>
        </div>
        
        <div class="result-item apr-result">
          <span class="result-label">
            {{ t('tools.creditCardApr.apr') }}:
            <el-tooltip :content="t('tools.creditCardApr.aprFormula')" placement="top">
              <el-icon><InfoFilled /></el-icon>
            </el-tooltip>
          </span>
          <span class="result-value highlight">{{ result.apr.toFixed(2) }}{{ t('tools.creditCardApr.rateUnit') }}</span>
        </div>
        
        <el-alert
          type="info"
          :title="t('tools.creditCardApr.disclaimer')"
          :closable="false"
          show-icon
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.credit-card-apr-calculator {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.calculator-card {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.card-header .el-icon {
  margin-right: 8px;
  font-size: 20px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

.calculation-result {
  margin-top: 24px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 16px;
}

.result-label {
  display: flex;
  align-items: center;
  color: #606266;
}

.result-label .el-icon {
  margin-left: 4px;
  font-size: 16px;
  color: #909399;
  cursor: help;
}

.result-value {
  font-weight: 500;
}

.apr-result {
  margin-top: 16px;
  margin-bottom: 20px;
  font-size: 18px;
}

.highlight {
  color: #409EFF;
  font-weight: bold;
}

.el-alert {
  margin-top: 20px;
}
</style>
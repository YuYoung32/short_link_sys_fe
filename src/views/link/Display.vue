<script>
/**
 * Created by YuYoung on 2023/3/23
 * Description: 短链显示
 */

import { ref } from 'vue';
import { Chart } from 'primevue/chart';
import { Button } from 'primevue/button';

export default {
  components: {
    Chart,
    Button,
  },
  setup() {
    const chartType = ref('line');
    const chartData = ref({
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Data One',
          data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(),
            randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
          borderColor: '#29B6F6',
          backgroundColor: 'rgba(41,182,246,0.2)',
        },
      ],
    });

    function updateChartData() {
      // generate new chart data
      const newData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Data One',
            data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(),
              randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
            borderColor: '#29B6F6',
            backgroundColor: 'rgba(41,182,246,0.2)',
          },
        ],
      };

      // update chart data
      chartData.value = newData;
    }

    function randomScalingFactor() {
      return Math.round(Math.random() * 100);
    }

    return {
      chartType,
      chartData,
      updateChartData,
    };
  },
};

</script>


<template>
  <div>
    <Button @click="updateChartData" label="Update Chart Data" />
    <Chart :type="chartType" :data="chartData" />
  </div>
</template>

<script setup lang="ts">
import { BlessSparkline } from "blessing-ui";
const visits = [12, 18, 14, 22, 30, 26, 34, 31, 40];
const profit = [4, -2, 6, -1, -3, 5, 7, 2, -4];
const form = [1, 1, -1, 1, 0, 1, -1, -1, 1, 1];
</script>

<template>
  <table class="bless-table" style="max-width: 520px">
    <thead>
      <tr>
        <th>Metric</th>
        <th>Last 9 days</th>
        <th>Shape</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Visits</td>
        <td><BlessSparkline :data="visits" label="Visits" fill dot /></td>
        <td>rising</td>
      </tr>
      <tr>
        <td>Profit</td>
        <td><BlessSparkline :data="profit" type="bar" label="Profit" /></td>
        <td>up and down</td>
      </tr>
      <tr>
        <td>Results</td>
        <td><BlessSparkline :data="form" type="winloss" label="Results" color="success" /></td>
        <td>6 wins, 3 losses</td>
      </tr>
    </tbody>
  </table>
</template>

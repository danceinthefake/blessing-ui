---
title: Weather forecast
---

<script setup>
import WeatherForecastBasic from "../demos/WeatherForecastBasic.vue";
</script>

# Weather forecast

<p class="bless-lead">The weather now and for the next days, with the high, the low, and the rain</p>

Shows the weather of one place in a weather app, a travel site, or an event page. The data comes from your weather service.

<Demo title="Basic">
  <WeatherForecastBasic />
  <template #code>

<<< ../demos/WeatherForecastBasic.vue

  </template>
</Demo>

- `place`, `temp`, and `weather` give the weather now. `feels-like`, `humidity` in percent, and `wind` in km/h are optional.
- `weather` is `clear`, `partly-cloudy`, `cloudy`, `rain`, `storm`, `snow`, or `fog`. Each has an icon and a word.
- `days` is the list of days. Each day has a `date` as YYYY-MM-DD, a `weather`, a `high`, a `low`, and an optional `rain` chance in percent.
- A bar shows the range of each day against the whole week, so warm and cool days are easy to see. Screen readers hear the weather word and "low 25°C, high 32°C".
- `unit` is `celsius` (default) or `fahrenheit`. Give the numbers in that unit. `locale` formats the numbers and the names of the days.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessWeatherForecast } from "blessing-ui";
```

## API

<PropsTable name="BlessWeatherForecast" />

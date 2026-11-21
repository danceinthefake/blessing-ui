<template>
  <BlessMarginComments :blocks :comments @add="add" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessMarginComments, type BlessMarginComment } from "blessing-ui";

const blocks = [
  {
    id: "p1",
    text: "Our studio sells microphones and foam panels to home recording artists across Indonesia.",
  },
  {
    id: "p2",
    text: "This quarter we plan to open a second warehouse in Surabaya, so orders in the east arrive in two days.",
  },
  {
    id: "p3",
    text: "The budget for the move is Rp 480 million, most of it for racks and the first three months of rent.",
  },
];
const comments = ref<BlessMarginComment[]>([
  {
    id: "c1",
    block: "p2",
    author: "Dimas",
    text: "Two days is our goal. Today it is four.",
    time: "Mon 09:12",
  },
  {
    id: "c2",
    block: "p3",
    author: "Sari",
    text: "Add the cost of the staff training.",
    time: "Mon 10:40",
  },
]);
let n = 3;
const add = (block: string, text: string) =>
  comments.value.push({ id: `c${n++}`, block, author: "You", text, time: "now" });
</script>

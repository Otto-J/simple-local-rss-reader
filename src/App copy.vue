<script setup lang="ts">
import Dexie, { type Table, type Collection } from "dexie";

import { liveQuery } from "dexie";
import { useObservable } from "@vueuse/rxjs";
import { db } from "./db";
//
// Declare Database
//

// const initDB = () => {
//   var db = new Dexie("FriendDatabase");
//   db.version(1).stores({
//     friends: "++id,name,age",
//   });

//   return db as any;
// };

// const db = initDB();

const friends = useObservable(liveQuery(() => db.friends.toArray()));
// const addItem = () => {
//   friends.add({ name: "Josephine", age: 21 }).then(() => {
//     console.log("added");
//   });
// };

// const list = useObservable(liveQuery(() => friends.toArray()));

// console.log(1, list.value);

// friends
//   // .add({ name: "Josephine", age: 21 })
//   .then(function () {
//     return friends.where("age").below(25).toArray();
//   })
//   .then(function (youngFriends) {
//     alert("My young friends: " + JSON.stringify(youngFriends));
//   })
//   .catch(function (e) {
//     alert("Error: " + (e.stack || e));
//   });
</script>

<template>
  <!-- <div @click="addItem">hi</div> -->
  <ul>
    <li v-for="friend in friends" :key="friend.id">
      {{ friend.name }}, {{ friend.age }}
    </li>
  </ul>
</template>

// A small emoji set: the common ones, with their CLDR short names, in eight groups. Flags are left
// out, because many systems draw them as two letters. Pass `emojis` to BlessEmojiPicker for more,
// or for names in another language.

export type BlessEmojiGroup =
  | "smileys"
  | "people"
  | "nature"
  | "food"
  | "activities"
  | "travel"
  | "objects"
  | "symbols";

export interface BlessEmoji {
  char: string;
  /** shown and searched; also the accessible name */
  name: string;
  group: BlessEmojiGroup;
  /** more words to search by */
  keywords?: string[];
}

// "char name|char name|…": short to ship, read once
const raw: Record<BlessEmojiGroup, string> = {
  smileys:
    "😀 grinning face|😃 grinning face with big eyes|😄 grinning face with smiling eyes|😁 beaming face with smiling eyes|😆 grinning squinting face|😅 grinning face with sweat|🤣 rolling on the floor laughing|😂 face with tears of joy|🙂 slightly smiling face|🙃 upside-down face|😉 winking face|😊 smiling face with smiling eyes|😇 smiling face with halo|🥰 smiling face with hearts|😍 smiling face with heart-eyes|🤩 star-struck|😘 face blowing a kiss|😋 face savoring food|😛 face with tongue|😜 winking face with tongue|🤪 zany face|🤗 smiling face with open hands|🤔 thinking face|🤫 shushing face|🤐 zipper-mouth face|😐 neutral face|😑 expressionless face|😶 face without mouth|😏 smirking face|😒 unamused face|🙄 face with rolling eyes|😬 grimacing face|😌 relieved face|😔 pensive face|😪 sleepy face|😴 sleeping face|😷 face with medical mask|🤒 face with thermometer|🤢 nauseated face|🥵 hot face|🥶 cold face|🥴 woozy face|😵 face with crossed-out eyes|🤯 exploding head|🤠 cowboy hat face|🥳 partying face|😎 smiling face with sunglasses|🤓 nerd face|😕 confused face|😟 worried face|😮 face with open mouth|😲 astonished face|😳 flushed face|🥺 pleading face|😢 crying face|😭 loudly crying face|😱 face screaming in fear|😖 confounded face|😣 persevering face|😞 disappointed face|😓 downcast face with sweat|😩 weary face|😫 tired face|🥱 yawning face|😤 face with steam from nose|😡 enraged face|😠 angry face|🤬 face with symbols on mouth|😈 smiling face with horns|💀 skull|💩 pile of poo|🤡 clown face|👻 ghost|👽 alien|🤖 robot",
  people:
    "👋 waving hand|🤚 raised back of hand|✋ raised hand|👌 OK hand|🤌 pinched fingers|✌️ victory hand|🤞 crossed fingers|🤟 love-you gesture|🤘 sign of the horns|🤙 call me hand|👈 backhand index pointing left|👉 backhand index pointing right|👆 backhand index pointing up|👇 backhand index pointing down|☝️ index pointing up|👍 thumbs up|👎 thumbs down|✊ raised fist|👊 oncoming fist|👏 clapping hands|🙌 raising hands|👐 open hands|🤝 handshake|🙏 folded hands|✍️ writing hand|💪 flexed biceps|👀 eyes|🧠 brain|👶 baby|🧒 child|🧑 person|👩 woman|👨 man|🧓 older person|🙋 person raising hand|🤷 person shrugging|🤦 person facepalming|🙇 person bowing",
  nature:
    "🐶 dog face|🐱 cat face|🐭 mouse face|🐹 hamster|🐰 rabbit face|🦊 fox|🐻 bear|🐼 panda|🐨 koala|🐯 tiger face|🦁 lion|🐮 cow face|🐷 pig face|🐸 frog|🐵 monkey face|🐔 chicken|🐧 penguin|🐦 bird|🦆 duck|🦉 owl|🐝 honeybee|🦋 butterfly|🐢 turtle|🐍 snake|🐙 octopus|🐟 fish|🐬 dolphin|🐳 spouting whale|🌸 cherry blossom|🌹 rose|🌻 sunflower|🌷 tulip|🌱 seedling|🌲 evergreen tree|🌴 palm tree|🍀 four leaf clover|🍁 maple leaf|🌙 crescent moon|☀️ sun|⭐ star|🌈 rainbow|☁️ cloud|⚡ high voltage|❄️ snowflake|🔥 fire|💧 droplet|🌊 water wave",
  food: "🍎 red apple|🍊 tangerine|🍋 lemon|🍌 banana|🍉 watermelon|🍇 grapes|🍓 strawberry|🍑 peach|🥭 mango|🍍 pineapple|🥥 coconut|🥑 avocado|🍅 tomato|🌶️ hot pepper|🌽 ear of corn|🥕 carrot|🍞 bread|🧀 cheese wedge|🍳 cooking|🍔 hamburger|🍟 french fries|🍕 pizza|🌮 taco|🍜 steaming bowl|🍝 spaghetti|🍣 sushi|🍙 rice ball|🍚 cooked rice|🍛 curry rice|🍢 oden|🍡 dango|🍦 soft ice cream|🍩 doughnut|🍪 cookie|🎂 birthday cake|🍰 shortcake|🍫 chocolate bar|🍬 candy|☕ hot beverage|🍵 teacup without handle|🧋 bubble tea|🍺 beer mug|🍷 wine glass|🥤 cup with straw",
  activities:
    "⚽ soccer ball|🏀 basketball|🏈 american football|⚾ baseball|🎾 tennis|🏐 volleyball|🏓 ping pong|🏸 badminton|🥅 goal net|⛳ flag in hole|🎣 fishing pole|🎽 running shirt|🎿 skis|🏆 trophy|🥇 1st place medal|🎮 video game|🎲 game die|🧩 puzzle piece|🎯 bullseye|🎳 bowling|🎨 artist palette|🎬 clapper board|🎤 microphone|🎧 headphone|🎵 musical note|🎸 guitar|🎹 musical keyboard|🥁 drum|🎉 party popper|🎊 confetti ball|🎁 wrapped gift|🎈 balloon|🎃 jack-o-lantern|🎄 Christmas tree|🎆 fireworks",
  travel:
    "🚗 automobile|🚕 taxi|🚌 bus|🚑 ambulance|🚒 fire engine|🚓 police car|🚲 bicycle|🛵 motor scooter|🏍️ motorcycle|🚆 train|🚄 high-speed train|🚇 metro|✈️ airplane|🚀 rocket|🛸 flying saucer|🚁 helicopter|⛵ sailboat|🚢 ship|⚓ anchor|🗺️ world map|🗻 mount fuji|🏔️ snow-capped mountain|🏖️ beach with umbrella|🏝️ desert island|🏠 house|🏢 office building|🏫 school|🏥 hospital|🏯 Japanese castle|🗼 Tokyo tower|⛩️ shinto shrine|🕌 mosque|🌋 volcano|🌃 night with stars|🌅 sunrise",
  objects:
    "⌚ watch|📱 mobile phone|💻 laptop|⌨️ keyboard|🖥️ desktop computer|🖨️ printer|🖱️ computer mouse|💾 floppy disk|📷 camera|📺 television|📻 radio|🔋 battery|🔌 electric plug|💡 light bulb|🔦 flashlight|📚 books|📖 open book|📝 memo|✏️ pencil|🖊️ pen|📎 paperclip|📌 pushpin|📅 calendar|📈 chart increasing|📉 chart decreasing|📊 bar chart|📦 package|✉️ envelope|📧 e-mail|🔒 locked|🔓 unlocked|🔑 key|🔨 hammer|🔧 wrench|⚙️ gear|🧲 magnet|🧪 test tube|💊 pill|🛒 shopping cart|💰 money bag|💳 credit card|⏰ alarm clock|⌛ hourglass done|🔔 bell|🔍 magnifying glass tilted left|🗑️ wastebasket",
  symbols:
    "❤️ red heart|🧡 orange heart|💛 yellow heart|💚 green heart|💙 blue heart|💜 purple heart|🖤 black heart|🤍 white heart|💔 broken heart|💕 two hearts|✨ sparkles|💯 hundred points|💢 anger symbol|💥 collision|💫 dizzy|💬 speech balloon|💤 zzz|✅ check mark button|❌ cross mark|❗ red exclamation mark|❓ red question mark|⚠️ warning|🚫 prohibited|♻️ recycling symbol|➕ plus|➖ minus|➗ divide|✖️ multiply|🔴 red circle|🟢 green circle|🔵 blue circle|🆗 OK button|🆕 NEW button",
};

/** the built-in set, in display order */
export const blessEmojis: BlessEmoji[] = (Object.keys(raw) as BlessEmojiGroup[]).flatMap((group) =>
  raw[group].split("|").map((entry) => {
    const at = entry.indexOf(" ");
    return { char: entry.slice(0, at), name: entry.slice(at + 1), group };
  }),
);

/** one emoji per group, for the group buttons */
export const blessEmojiGroupIcons: Record<BlessEmojiGroup, string> = {
  smileys: "😀",
  people: "👋",
  nature: "🐶",
  food: "🍎",
  activities: "⚽",
  travel: "🚗",
  objects: "💡",
  symbols: "❤️",
};

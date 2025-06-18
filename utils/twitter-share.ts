import type { GachaItem } from "@/types/gacha";

export function shareToTwitter(item: GachaItem, isNewItem: boolean) {
  const collectionEmojis = {
    toys: "🎀",
    magic: "🔮",
    fantasy: "👑",
    tech: "⚡",
    nature: "🌿",
    space: "🌟",
  };

  const versionEmojis = {
    standard: "✨",
    hidden: "🌟",
  };

  // Create the tweet text
  const tweetText = [
    `Just pulled a ${
      collectionEmojis[item.collection]
    } ${item.collection.toUpperCase()} collection ${item.name} ${item.emoji}`,
    `${versionEmojis[item.version]} ${item.version.toUpperCase()} version!`,
    isNewItem ? "🎉 NEW ITEM!" : "📚 Already in my collection",
    "",
    "#GachaZone #GachaPull #CollectibleGaming",
  ].join("\n");

  // Add extra hashtags for special items
  const extraHashtags =
    item.collection === "space"
      ? " #SpaceCollection #RareFind"
      : item.collection === "fantasy"
      ? " #FantasyPull"
      : "";

  const finalTweet = tweetText + extraHashtags;

  // Create Twitter URL
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    finalTweet
  )}`;

  // Open in new window
  window.open(twitterUrl, "_blank", "width=550,height=420");
}

export function shareCollectionMilestone(
  totalItems: number,
  uniqueItems: number,
  spaceCount: number
) {
  const tweetText = [
    `🎮 My Gacha Zone Collection Stats:`,
    `📦 ${totalItems} Total Items`,
    `🌟 ${uniqueItems} Unique Items`,
    `🚀 ${spaceCount} Space Collection Items`,
    "",
    "#GachaZone #Collection #GachaMaster",
  ].join("\n");

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetText
  )}`;
  window.open(twitterUrl, "_blank", "width=550,height=420");
}

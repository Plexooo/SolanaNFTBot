import Discord, { MessageEmbed, TextChannel } from "discord.js";
import { NFTSale } from "lib/marketplaces";

const status: {
  totalNotified: number;
  lastNotified?: Date;
} = {
  totalNotified: 0,
};

export function getStatus() {
  return status;
}

export default async function notifyDiscordSale(
  client: Discord.Client,
  channel: TextChannel,
  nftSale: NFTSale
) {
  if (!client.isReady()) {
    return;
  }

  const { marketplace, nftData } = nftSale;
  const description = `Sold for ${nftSale.getPriceInSOL()} SOL at ${marketplace.name}`;
  const embedMsg = new MessageEmbed({
    color: "#00ff84",
    title: nftData?.name + ' is gone!',
    url: marketplace.itemURL(nftSale.token),
    fields: [
      {
        name: 'Price',
        value: nftSale.getPriceInSOL() + ' SOL',
      },
      {
        name: 'Marketplace',
        value: marketplace.name,
      },      
      {
        name: 'Address',
        value: nftSale.token,
      },
    ],
    image: {
      url: nftData?.image,
    },
    timestamp: new Date(),
  });
  await channel.send({
    embeds: [embedMsg],
  });
  const logMsg = `Notified discord #${channel.name}: ${nftData?.name} - ${description}`;
  console.log(logMsg);

  status.lastNotified = new Date();
  status.totalNotified++;
}

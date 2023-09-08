/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, GatewayIntentBits } from 'discord.js';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

const grantRole = catchAsync(async (req, res) => {
  const data = req.body;
  const discordServerId = process.env.discordServerId;
  const roleId = process.env.roleId;
  const botToken = process.env.botToken;

  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  });

  await client.login(botToken);
  const guild = await client.guilds.fetch(discordServerId as string);
  const member = await guild.members.fetch(data.userId);
  console.log({ member });
  const roles = member?.roles?.cache
    .filter(role => role.id !== discordServerId) // Exclude the @everyone role
    .map(role => role.name);

  //   if (member) {
  //     const role = member.guild.roles.cache.find(
  //       role => role.name === 'Qualified Role'
  //     );
  //     if (role) {
  //       await member.roles.add(role);
  //       member.channel.send(
  //         `Congratulations! You've been granted the Qualified Role.`
  //       );
  //     } else {
  //       member.channel.send(
  //         `The Qualified Role doesn't exist. Please contact the server administrator.`
  //       );
  //     }
  //   } else {
  //     message.channel.send(`Sorry, you don't meet the qualification criteria.`);
  //   }

  if (roles.length < 1) {
    const role = await guild.roles.fetch(roleId as string);
    await member.roles.add(role as any);
    sendResponse<any>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Added new role successfully',
    });
  }

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Role get successfully',
    data: roles,
  });
});

export const DiscordController = {
  grantRole,
};

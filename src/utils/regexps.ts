/** @pattern `/^\d{17,}$/` */
export const DiscordSnowflakePattern = /^\d{17,}$/;

/** @pattern `/\d{17,}/g` */
export const ManyDiscordSnowflakesPattern = /\d{17,}/g;

/** 
 * Matches `channel`, `command`, `emoji`, `member`, `role` or `user` mention
 * 
 * @pattern `/<(?:(?:a?:\w{1,32}|\/\w{1,32}(?:\s\w{1,32}){0,2}):|[#]|[@][!&]?)(?<id>\d{17,})>/`
 * 
 * https://discord.com/developers/docs/reference#message-formatting
 */
export const DiscordMentionPattern = /<(?:(?:a?:\w{1,32}|\/\w{1,32}(?:\s\w{1,32}){0,2}):|[#]|[@][!&]?)(?<id>\d{17,})>/;

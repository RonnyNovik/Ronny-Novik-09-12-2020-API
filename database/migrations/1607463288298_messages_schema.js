"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class MessagesSchema extends Schema {
  up() {
    this.create("messages", (table) => {
      table.increments();
      table.string("topic", 255).notNullable();
      table.string("content", 255).notNullable();
      table.boolean("was_read").notNullable();
      table.string("recipient_name", 255).notNullable();
      table.string("sender_name", 255).notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("messages");
  }
}

module.exports = MessagesSchema;

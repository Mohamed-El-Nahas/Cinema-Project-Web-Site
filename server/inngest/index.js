import { Inngest } from "inngest";
import user from "../models/user.js";

export const inngest = new Inngest({ id: "movie-ticket-booking" });

// Inngest function to save user data to database
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerc" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + "" + last_name,
      image: image_url,
    };
    await user.create(userData);
  }
);

// Inggest function to delete user from database
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerc" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await user.findByIdAndDelete(id);
  }
);

// Inggest function to update user from database
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerc" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + "" + last_name,
      image: image_url,
    };
    await user.findByIdAndUpdate(id, userData);
  }
);

export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];

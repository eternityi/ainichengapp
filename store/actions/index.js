import types from "../types";

export default {
  updateUnreads(unreads) {
    return {
      type: types.UPDATE_UNREADS,
      unreads
    };
  },

  updateAvatar(avatar, timestamp) {
    return {
      type: types.UPDATE_AVATAR,
      avatar,
      timestamp
    };
  },

  updateName(name) {
    return {
      type: types.UPDATE_NAME,
      name
    };
  },

  updateIntroduction(introduction) {
    return {
      type: types.UPDATE_INTRODUCTION,
      introduction
    };
  },

  signIn(user) {
    return {
      type: types.SIGN_IN,
      user
    };
  },

  signOut() {
    return {
      type: types.SIGN_OUT
    };
  },

  editCategoryAdmins(userIds) {
    return {
      type: types.EDIT_CATEGORY_ADMINS,
      userIds
    };
  }
};

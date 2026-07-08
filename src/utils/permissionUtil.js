export const hasAccess = (permissions, featureKey, action = "Read") => {
    if (!permissions || !permissions[featureKey]) return false;
    return permissions[featureKey][action] === true;
};
/**
 * Adds a new skill to the list if it's non-empty and not already present.
 * Returns the updated skills array.
 */
export const addSkill = (skills, input) => {
  const trimmed = input.trim();
  if (trimmed && !skills.includes(trimmed)) {
    return [...skills, trimmed];
  }
  return skills;
};

/**
 * Removes a skill from the list by value.
 * Returns the updated skills array.
 */
export const removeSkill = (skills, skill) =>
  skills.filter((s) => s !== skill);

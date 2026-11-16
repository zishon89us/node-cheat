//------------------------------------------------------
// Promises - always land in the "then" branch, resolved or rejected
// Web Link=> https://stackoverflow.com/a/49797011/3539857
// Run : node always-then.js
//------------------------------------------------------

const getUserData = async (userId) => {
  if (userId === 'missing') throw new Error('not found');
  return { Item: { UserId: userId } };
};

async function handleAlwaysThen(userId) {
  try {
    const data = await getUserData(userId);
    return data.Item.UserId === userId
      ? { success: true, checkFirst: 'returning' }
      : { success: false, checkFirst: 'UserId not matched' };
  } catch {
    return { success: false, checkFirst: 'firstSession' };
  }
}

console.log(await handleAlwaysThen('42'));
console.log(await handleAlwaysThen('missing'));

// Built-in alternative: Promise.allSettled never rejects
const [result] = await Promise.allSettled([getUserData('missing')]);
console.log(result.status, result.reason?.message);

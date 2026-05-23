const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_PROFILES = [
  { id: '1', name: 'Đỗ Anh', avatar: 'https://via.placeholder.com/200/5c5c5c/ffffff?text=DA', isKid: false },
  { id: '2', name: 'Quỳnh Anh', avatar: 'https://via.placeholder.com/200/5c5c5c/ffffff?text=QA', isKid: false },
];

let profiles = [...MOCK_PROFILES];
let nextId = 3;

export const getProfilesApi = async () => {
  await delay(500);
  return [...profiles];
};

export const getProfileApi = async (id) => {
  await delay(300);
  const profile = profiles.find((p) => p.id === id);
  if (!profile) throw new Error('Không tìm thấy hồ sơ');
  return { ...profile };
};

export const createProfileApi = async (data) => {
  await delay(800);
  const newProfile = { id: String(nextId++), ...data, avatar: data.avatar || 'https://via.placeholder.com/200/5c5c5c/ffffff?text=New' };
  profiles.push(newProfile);
  return { ...newProfile };
};

export const updateProfileApi = async ({ id, ...data }) => {
  await delay(800);
  const index = profiles.findIndex((p) => p.id === id);
  if (index === -1) throw new Error('Không tìm thấy hồ sơ');
  profiles[index] = { ...profiles[index], ...data };
  return { ...profiles[index] };
};

export const deleteProfileApi = async (id) => {
  await delay(800);
  const index = profiles.findIndex((p) => p.id === id);
  if (index === -1) throw new Error('Không tìm thấy hồ sơ');
  profiles.splice(index, 1);
  return id;
};

const AVATAR_SEEDS = [
  'Felix', 'Aneka', 'Salem', 'Midge',
  'Kitty', 'Loki', 'Simba', 'Nala',
  'Oreo', 'Peanut', 'Mochi', 'Bella',
  'Coco', 'Max', 'Luna', 'Charlie',
];

export const getAvatarsApi = async () => {
  await delay(300);
  return AVATAR_SEEDS.map((seed) => ({
    seed,
    url: `https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}`,
  }));
};

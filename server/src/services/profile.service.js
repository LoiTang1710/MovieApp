const AVATAR_SEEDS = [
  'Felix', 'Aneka', 'Salem', 'Midge',
  'Kitty', 'Loki', 'Simba', 'Nala',
  'Oreo', 'Peanut', 'Mochi', 'Bella',
  'Coco', 'Max', 'Luna', 'Charlie',
];

const MOCK_PROFILES = [
  { id: '1', name: 'Đỗ Anh', avatar: 'https://via.placeholder.com/200/5c5c5c/ffffff?text=DA', isKid: false },
  { id: '2', name: 'Quỳnh Anh', avatar: 'https://via.placeholder.com/200/5c5c5c/ffffff?text=QA', isKid: false },
];

let profiles = [...MOCK_PROFILES];
let nextId = 3;

export const getProfiles = async () => {
  return [...profiles];
};

export const getProfile = async (id) => {
  const profile = profiles.find((p) => p.id === id);
  if (!profile) {
    const error = new Error('Không tìm thấy hồ sơ');
    error.statusCode = 404;
    throw error;
  }
  return { ...profile };
};

export const createProfile = async (data) => {
  const newProfile = {
    id: String(nextId++),
    name: data.name,
    avatar: data.avatar || 'https://via.placeholder.com/200/5c5c5c/ffffff?text=New',
    isKid: data.isKid || false,
  };
  profiles.push(newProfile);
  return { ...newProfile };
};

export const updateProfile = async (id, data) => {
  const index = profiles.findIndex((p) => p.id === id);
  if (index === -1) {
    const error = new Error('Không tìm thấy hồ sơ');
    error.statusCode = 404;
    throw error;
  }
  profiles[index] = { ...profiles[index], ...data };
  return { ...profiles[index] };
};

export const deleteProfile = async (id) => {
  const index = profiles.findIndex((p) => p.id === id);
  if (index === -1) {
    const error = new Error('Không tìm thấy hồ sơ');
    error.statusCode = 404;
    throw error;
  }
  profiles.splice(index, 1);
  return { id };
};

export const getAvatars = async () => {
  return AVATAR_SEEDS.map((seed) => ({
    seed,
    url: `https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}`,
  }));
};

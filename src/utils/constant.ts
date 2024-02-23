export const CONTENT_TYPE = {
  MP3: 'audio/mp3',
};

export const HEADER = {
  CONTENT_DISPOSITION: {
    NAME: 'Content-disposition',
    VALUE: (filename: string) => `attachment; filename=${filename}.mp3`,
  },
};

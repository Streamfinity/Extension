import { describe, expect, it } from 'vitest';
import { getIdFromLink, isVideoUrl } from '~/common/utility';
import { prettyDuration, why } from '~/common/pretty';

describe('isVideoUrl', () => {
    it.each([
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://m.youtube.com/watch?v=dQw4w9WgXcQ&t=10',
        'https://www.youtube.com/shorts/dQw4w9WgXcQ',
        'https://www.youtube.com/e/dQw4w9WgXcQ',
        'https://youtu.be/dQw4w9WgXcQ',
        'https://www.twitch.tv/videos/123456789',
        'https://www.twitch.tv/streamer/clip/FunnyClip-abc_123',
    ])('accepts %s', (url) => {
        expect(isVideoUrl(url)).toBe(true);
    });

    it.each([
        'https://www.youtube.com/',
        'https://www.youtube.com/@channel',
        'https://youtu.be/',
        'https://www.twitch.tv/streamer',
        'https://streamfinity.tv/watch?v=dQw4w9WgXcQ',
        'not a url',
        null,
    ])('rejects %s', (url) => {
        expect(isVideoUrl(url)).toBe(false);
    });
});

describe('getIdFromLink', () => {
    it('extracts video id', () => {
        expect(getIdFromLink('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10')).toBe('dQw4w9WgXcQ');
    });

    it('returns null without id', () => {
        expect(getIdFromLink('https://www.youtube.com/@channel')).toBeNull();
    });
});

describe('prettyDuration', () => {
    it('formats durations', () => {
        expect(prettyDuration(75)).toBe('01:15');
        expect(prettyDuration(3725)).toBe('01:02:05');
    });
});

describe('why', () => {
    it('reads error messages', () => {
        expect(why('plain')).toBe('plain');
        expect(why(new Error('broken'))).toBe('broken');
        expect(why({ response: { data: { errors: { url: ['Invalid url'] } } } })).toBe('Invalid url');
    });
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hasOtherVideoLink, isYouTubeVideoUrl } from '../src/common/reactionCandidate.js';

test('detects links to other videos', () => {
    assert.equal(hasOtherVideoLink('Original video: https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=0s', 'aaaaaaaaaaa'), true);
    assert.equal(hasOtherVideoLink('Original: https://youtu.be/dQw4w9WgXcQ', 'aaaaaaaaaaa'), true);
    assert.equal(hasOtherVideoLink('youtube.com/watch?v=dQw4w9WgXcQ', 'aaaaaaaaaaa'), true);
});

test('ignores descriptions without other video links', () => {
    assert.equal(hasOtherVideoLink('', 'aaaaaaaaaaa'), false);
    assert.equal(hasOtherVideoLink(null, 'aaaaaaaaaaa'), false);
    assert.equal(hasOtherVideoLink('Merch: https://shop.example.com', 'aaaaaaaaaaa'), false);
    assert.equal(hasOtherVideoLink('Channel: https://www.youtube.com/@creator', 'aaaaaaaaaaa'), false);
    assert.equal(hasOtherVideoLink('Rewatch: https://youtu.be/aaaaaaaaaaa', 'aaaaaaaaaaa'), false);
});

test('finds other link next to self link', () => {
    assert.equal(hasOtherVideoLink('https://youtu.be/aaaaaaaaaaa\nhttps://youtu.be/dQw4w9WgXcQ', 'aaaaaaaaaaa'), true);
});

test('matches youtube video urls', () => {
    assert.equal(isYouTubeVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=0s'), true);
    assert.equal(isYouTubeVideoUrl('https://www.youtube.com/@creator'), false);
    assert.equal(isYouTubeVideoUrl('https://www.youtube.com/redirect?q=https%3A%2F%2Fshop.example.com'), false);
});

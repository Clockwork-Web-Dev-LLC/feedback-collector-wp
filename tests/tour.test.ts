import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { TOUR_VERSION, Tour, markTourSeen, tourSeen } from '../src/overlay/tour';

let mount: HTMLDivElement;
let target: HTMLButtonElement;

beforeEach(() => {
  window.localStorage.clear();
  mount = document.createElement('div');
  target = document.createElement('button');
  document.body.append(mount, target);
});
afterEach(() => {
  document.body.replaceChildren();
});

const steps = () => [
  { title: 'Welcome', body: 'Intro' },
  { title: 'Missing', body: 'Not on screen', target: () => null },
  { title: 'Toolbar', body: 'Here', target: () => target },
  { title: 'End', body: 'Bye' },
];
const title = () => mount.querySelector('.tour-title')?.textContent;
const click = (sel: string) => (mount.querySelector(sel) as HTMLButtonElement).click();

describe('tour', () => {
  it('skips steps whose element is not on screen and counts the rest', () => {
    const t = new Tour(mount);
    t.start(steps());
    expect(title()).toBe('Welcome');
    expect(mount.querySelector('.tour-count')?.textContent).toBe('1 of 3');
    click('.tour-next');
    expect(title()).toBe('Toolbar');
  });

  it('Back, Next and the last step’s “Got it” finish it and mark it seen', () => {
    let done = 0;
    const t = new Tour(mount, () => {
      done++;
      markTourSeen();
    });
    t.start(steps());
    click('.tour-next');
    click('.tour-back');
    expect(title()).toBe('Welcome');
    expect(mount.querySelector('.tour-back')).toBeNull();
    click('.tour-next');
    click('.tour-next');
    expect(title()).toBe('End');
    expect(mount.querySelector('.tour-skip')).toBeNull();
    expect(mount.querySelector('.tour-next')?.textContent).toBe('Got it');
    click('.tour-next');
    expect(t.open).toBe(false);
    expect(mount.querySelector('.tour')).toBeNull();
    expect(done).toBe(1);
    expect(tourSeen()).toBe(true);
  });

  it('Skip and Escape end it as seen; closing without finishing does not', () => {
    let done = 0;
    const t = new Tour(mount, () => done++);
    t.start(steps());
    click('.tour-skip');
    expect(done).toBe(1);
    t.start(steps());
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(done).toBe(2);
    expect(t.open).toBe(false);
    t.start(steps());
    t.close(false);
    expect(done).toBe(2);
  });

  it('arrow keys step through', () => {
    const t = new Tour(mount);
    t.start(steps());
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(title()).toBe('Toolbar');
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(title()).toBe('Welcome');
    t.close(false);
  });

  it('seen is per version', () => {
    expect(tourSeen()).toBe(false);
    window.localStorage.setItem('fbc:tour', '0');
    expect(tourSeen()).toBe(false);
    markTourSeen();
    expect(window.localStorage.getItem('fbc:tour')).toBe(TOUR_VERSION);
  });

  it('nothing to show → nothing opens', () => {
    const t = new Tour(mount);
    t.start([{ title: 'x', body: 'y', target: () => null }]);
    expect(t.open).toBe(false);
  });
});

describe('tour steps that open things', () => {
  it('enter() runs when the step shows, leave() when it is left or the tour closes', () => {
    const log: string[] = [];
    let opened: HTMLElement | null = null;
    const t = new Tour(mount);
    t.start([
      { title: 'A', body: '' },
      {
        title: 'Form',
        body: '',
        opens: true,
        enter: () => {
          log.push('enter');
          opened = document.createElement('form');
          document.body.append(opened);
        },
        leave: () => {
          log.push('leave');
          opened?.remove();
          opened = null;
        },
        target: () => opened,
      },
      { title: 'C', body: '' },
    ]);
    expect(mount.querySelector('.tour-count')?.textContent).toBe('1 of 3'); // kept although not open yet
    click('.tour-next');
    expect(title()).toBe('Form');
    expect(opened).not.toBeNull();
    click('.tour-next');
    expect(log).toEqual(['enter', 'leave']);
    click('.tour-back');
    expect(log).toEqual(['enter', 'leave', 'enter']);
    t.close(true);
    expect(log).toEqual(['enter', 'leave', 'enter', 'leave']);
    expect(opened).toBeNull();
  });
});

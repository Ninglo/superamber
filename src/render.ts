import { getCircularGroupCountFromGroups, getCircularSlotMap, getRowsGroupCountFromGroups, getRowsSlotMap } from './layouts';
import type { AppState } from './types';

interface RenderHandlers {
  handleSeatChange: (groupIndex: number, seatIndex: number, value: string) => void;
  handleRowSeatChange: (rowIndex: number, side: 'left' | 'right', seatIndex: number, value: string) => void;
  handleArcSeatChange: (rowIndex: number, seatIndex: number, value: string) => void;
}

const asElement = <T extends Element>(selector: string): T => {
  const node = document.querySelector(selector);
  if (!node) {
    throw new Error(`Element not found: ${selector}`);
  }
  return node as T;
};

const makeInput = (value: string, fontSize: number, readonly: boolean): HTMLInputElement => {
  const input = document.createElement('input');
  input.type = 'text';
  input.value = value;
  input.style.fontSize = `${fontSize}px`;
  if (readonly) {
    input.readOnly = true;
  }
  return input;
};

const maxNameLength = (names: string[], fallback = 1): number =>
  Math.max(...names.filter((name) => name).map((name) => name.length), fallback);

export const refreshSeating = (state: AppState, handlers: RenderHandlers): void => {
  const classroom = asElement<HTMLDivElement>('#classroom');
  classroom.innerHTML = '';

  if (state.currentLayout === 'circular') {
    classroom.className = 'classroom';
    refreshCircularSeating(state, handlers);
  } else if (state.currentLayout === 'rows') {
    classroom.className = 'classroom three-rows-layout';
    refreshRowSeating(state, handlers);
  } else {
    classroom.className = 'classroom arc-layout';
    refreshArcSeating(state, handlers);
  }
};

const refreshCircularSeating = (state: AppState, handlers: RenderHandlers): void => {
  const classroom = asElement<HTMLDivElement>('#classroom');
  const activeGroupCount = getCircularGroupCountFromGroups(state.groups);
  const slotMap = getCircularSlotMap(activeGroupCount);

  for (let slotIndex = 0; slotIndex < 6; slotIndex += 1) {
    const logicalGroupIndex = slotMap[slotIndex];
    const table = document.createElement('div');

    if (logicalGroupIndex === null) {
      table.className = 'table table-empty';
      table.innerHTML = '<h3>空组</h3><div class="seats seats-empty"></div>';
      classroom.appendChild(table);
      continue;
    }

    table.className = `table group-${(logicalGroupIndex % 6) + 1}`;

    const title = document.createElement('h3');
    title.textContent = `Group ${logicalGroupIndex + 1}`;
    table.appendChild(title);

    const seats = document.createElement('div');
    seats.className = 'seats';

    const maxLength = maxNameLength(state.groups[logicalGroupIndex], 1);
    const fontSize = Math.min(16, Math.max(10, Math.floor(140 / maxLength)));

    for (let seatIndex = 0; seatIndex < 6; seatIndex += 1) {
      const seat = document.createElement('div');
      seat.className = 'seat';
      const student = state.groups[logicalGroupIndex][seatIndex] || '';
      const input = makeInput(student, fontSize, !state.isEditMode);
      input.onchange = () => handlers.handleSeatChange(logicalGroupIndex, seatIndex, input.value);
      seat.appendChild(input);
      seats.appendChild(seat);
    }

    table.appendChild(seats);
    classroom.appendChild(table);
  }
};

const refreshRowSeating = (state: AppState, handlers: RenderHandlers): void => {
  const classroom = asElement<HTMLDivElement>('#classroom');
  const activeGroupCount = getRowsGroupCountFromGroups(state.rowGroups);
  const slotMap = getRowsSlotMap(activeGroupCount);

  const rows = [
    { leftSlot: 0, rightSlot: 1 },
    { leftSlot: 2, rightSlot: 3 },
    { leftSlot: 4, rightSlot: 5 }
  ];

  rows.forEach((rowMeta, rowIndex) => {
    const rowElement = document.createElement('div');
    rowElement.className = 'row';

    const leftGroupIndex = slotMap[rowMeta.leftSlot];
    const rightGroupIndex = slotMap[rowMeta.rightSlot];

    const leftData = state.rowGroups.rows[rowIndex].left;
    const rightData = state.rowGroups.rows[rowIndex].right;

    const isSingleCenter = rowIndex === 2 && leftGroupIndex !== null && rightGroupIndex === null;
    if (isSingleCenter) {
      rowElement.classList.add('single-center');
    }

    const buildGroup = (position: 'left' | 'right'): HTMLDivElement => {
      const group = document.createElement('div');
      group.className = position === 'left' ? 'group-left' : 'group-right';

      const currentGroupIndex = position === 'left' ? leftGroupIndex : rightGroupIndex;
      const currentData = position === 'left' ? leftData : rightData;
      const sideKey = position;

      const title = document.createElement('h3');
      title.textContent = currentGroupIndex === null ? '空组' : `Group ${currentGroupIndex + 1}`;
      group.appendChild(title);

      const seats = document.createElement('div');
      seats.className = 'seats-row';

      const maxLength = maxNameLength(currentData, 1);
      const fontSize = Math.min(16, Math.max(10, Math.floor(140 / maxLength)));

      currentData.forEach((student, seatIndex) => {
        if (!student) {
          return;
        }

        const seat = document.createElement('div');
        seat.className = 'seat';
        const input = makeInput(student, fontSize, !state.isEditMode || currentGroupIndex === null);
        input.onchange = () => handlers.handleRowSeatChange(rowIndex, sideKey, seatIndex, input.value);
        seat.appendChild(input);
        seats.appendChild(seat);
      });

      group.appendChild(seats);
      return group;
    };

    const leftGroup = buildGroup('left');
    const rightGroup = buildGroup('right');

    if (isSingleCenter) {
      leftGroup.classList.add('group-center');
      rowElement.appendChild(leftGroup);
    } else {
      rowElement.appendChild(leftGroup);
      rowElement.appendChild(rightGroup);
    }

    classroom.appendChild(rowElement);
  });
};

const refreshArcSeating = (state: AppState, handlers: RenderHandlers): void => {
  const classroom = asElement<HTMLDivElement>('#classroom');
  const colors = ['#fff3b0', '#a8d5ff'];

  state.arcGroups.rows.forEach((row, rowIndex) => {
    const rowElement = document.createElement('div');
    rowElement.className = 'arc-row';
    rowElement.style.background = colors[rowIndex % colors.length];

    const seats = document.createElement('div');
    seats.className = 'arc-seats';

    const maxLength = maxNameLength(row, 1);
    const fontSize = Math.min(16, Math.max(12, Math.floor(140 / maxLength)));

    const n = row.length;
    const center = (n - 1) / 2;
    const maxOffset = 20;

    for (let i = 0; i < row.length; i += 1) {
      const student = row[i] || '';
      const seat = document.createElement('div');
      seat.className = 'seat arc-seat';

      const distanceFromCenter = Math.abs(i - center);
      const radius = center;
      const upwardOffset =
        distanceFromCenter <= radius
          ? Math.round(Math.sqrt(radius * radius - distanceFromCenter * distanceFromCenter) * (maxOffset / radius))
          : 0;

      seat.style.marginBottom = `${upwardOffset}px`;
      seat.style.display = 'inline-block';
      seat.style.verticalAlign = 'bottom';

      const input = makeInput(student, fontSize, !state.isEditMode);
      input.onchange = () => handlers.handleArcSeatChange(rowIndex, i, input.value);

      seat.appendChild(input);
      seats.appendChild(seat);
    }

    rowElement.appendChild(seats);
    classroom.appendChild(rowElement);
  });
};

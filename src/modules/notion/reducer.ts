import { EMOJI_ARR } from "./emojiData";
import { Notion, TrashPage, Page, Block, BlockStyle, BlockType } from "./type";
import {
  findBlock,
  findParentBlock,
  getBlockText,
  findPreviousBlockInDoc,
  findPage,
} from "../../fn";
import {
  bg_blue,
  bg_default,
  bg_green,
  bg_grey,
  bg_pink,
  bg_yellow,
  blue,
  defaultColor,
} from "./colorData";
const imgBlockImg =
  "https://raw.githubusercontent.com/BadaHertz52/notion/master/src/assets/img/roses.webp";
const basicPageIcon =
  "https://raw.githubusercontent.com/BadaHertz52/notion/master/src/assets/img/basic-page.webp";

export const blockTypes: BlockType[] = [
  "text",
  "toggle",
  "todo",
  "todo_done",
  "image",
  "h1",
  "h2",
  "h3",
  "page",
  "numberList",
  "bulletList",
];

export const basicBlockStyle: BlockStyle = {
  color: defaultColor,
  bgColor: bg_default,
  width: undefined,
  height: undefined,
};
const userName = "user";
const editTime = JSON.stringify(Date.now());

export const blockSample: Block = {
  id: `blockSample_${editTime}`,
  contents: "",
  firstBlock: true,
  subBlocksId: null,
  parentBlocksId: null,
  type: "text",
  iconType: null,
  icon: null,
  editTime: editTime,
  createTime: JSON.stringify(Date.now()),
  style: basicBlockStyle,
  comments: null,
};

export const pageSample: Page = {
  id: editTime,
  type: "page",
  header: {
    title: "untitle",
    iconType: "img",
    icon: basicPageIcon,
    cover: null,
    comments: null,
  },
  firstBlocksId: null,
  blocks: null,
  blocksId: null,
  subPagesId: null,
  parentsId: null,
  editTime: editTime,
  createTime: editTime,
};

//  < --- action---------------
const ADD_BLOCK = "notion/ADD_BLOCK" as const;
const EDIT_BLOCK = "notion/EDIT_BLOCK" as const;
const CHANGE_BLOCK_TO_PAGE = "notion/CHANGE_BLOCK_TO_PAGE" as const;
const CHANGE_PAGE_TO_BLOCK = "notion/CHANGE_PAGE_TO_BLOCK" as const;
const DELETE_BLOCK = "notion/DELETE_BLOCK" as const;
const CHANGE_TO_SUB_BLOCK = "notion/CHANGE_TO_SUB_BLOCK" as const;
const RAISE_BLOCK = "notion/RAISE_BLOCK" as const;

const ADD_PAGE = "notion/ADD_PAGE" as const;
const DUPLICATE_PAGE = "notion/DUPLICATE_PAGE" as const;
const EDIT_PAGE = "notion/EDIT_PAGE" as const;
const MOVE_PAGE_TO_PAGE = "notion/MOVE_PAGE_TO_PAGE" as const;
const DELETE_PAGE = "notion/DELETE_PAGE" as const;
const RESTORE_PAGE = "notion/RESTORE_PAGE" as const;
const CLEAN_TRASH = "notion/CLEAN_TRASH" as const;

const ADD_TEMPLATE = "notion/ADD_TEMPLATE" as const;
const CANCEL_EDIT_TEMPLATE = "notion/CANCEL_EDIT_TEMPLATE" as const;
const DELETE_TEMPLATE = "notion/DELETE_TEMPLATE" as const;
/**
 * page에 새로운 block을 추가하는 액션함수
 * @param pageId block을 추가할 page의 id
 * @param block  추가할 block
 * @param newBlockIndex  page.blocksId 나 page.blocks에 새로운 블록의 index
 * @param previousBlockId 새로운 블록이 특정 위치에 존재해야할 경우 , 화면상에서 새로운 블록의 바로 이전에 위치한 block의 id
 * @returns
 */
export const add_block = (
  pageId: string,
  block: Block,
  newBlockIndex: number,
  previousBlockId: string | null
) => ({
  type: ADD_BLOCK,
  pageId: pageId,
  block: block,
  newBlockIndex: newBlockIndex,
  /**블록의 위치를 특정할 때 필요  */
  previousBlockId: previousBlockId,
});
export const edit_block = (pageId: string, block: Block) => ({
  type: EDIT_BLOCK,
  pageId: pageId,
  /**수정된 block*/
  block: block,
});
export const change_block_to_page = (currentPageId: string, block: Block) => ({
  type: CHANGE_BLOCK_TO_PAGE,
  pageId: currentPageId,
  /** page type 으로 변경된 block */
  block: block,
});
export const change_page_to_block = (currentPageId: string, block: Block) => ({
  type: CHANGE_PAGE_TO_BLOCK,
  pageId: currentPageId,
  /** page type 에서 다른 blockType 으로 변경된 block */
  block: block,
});
export const delete_block = (
  pageId: string,
  block: Block,
  isInMenu: boolean
) => ({
  type: DELETE_BLOCK,
  pageId: pageId,
  /** 삭제될 block */
  block: block,
  /** block 삭제가 menu의 delete 로 이루어진 경우  */
  isInMenu: isInMenu,
});
/**
 * block을 화면상에서 앞에 위치한 block의 subBlock으로 변경하는 액션함수
 * @param pageId  : 현재 페이지의 id
 * @param block : subBlock 으로 변경될 block
 * @param newParentBlockId : subBlock이 될 block의 새로운 parentBlock의 id
 * @returns
 */
export const change_to_sub = (
  pageId: string,
  block: Block,
  newParentBlockId: string
) => ({
  type: CHANGE_TO_SUB_BLOCK,
  pageId: pageId,
  block: block,
  newParentBlockId: newParentBlockId,
});
/**
 * block이 삭제되거나 block의 content 맨앞에서 backspace 를 누르는 경우, block의 내용이 화면상에서 block의 앞에 위치한 이전 상의 block의 내용과 합쳐지거나, 위치가 앞으로 당겨지도록 하는 액션 함수
 * @param pageId 현재 페이지의 id
 * @param block  내용이 합쳐지거나 앞으로 당겨질 block
 * @returns
 */
export const raise_block = (pageId: string, block: Block) => ({
  type: RAISE_BLOCK,
  pageId: pageId,
  block: block,
});

export const add_page = (newPage: Page) => ({
  type: ADD_PAGE,
  pageId: "0", // 불필요하지만 다른 액션함수들에게 필요한 거라 일단 넣어줌
  newPage: newPage,
  block: null,
});

export const duplicate_page = (targetPageId: string) => ({
  type: DUPLICATE_PAGE,
  pageId: targetPageId,
  block: null,
});
export const edit_page = (pageId: string, newPage: Page) => ({
  type: EDIT_PAGE,
  pageId: pageId,
  newPage: newPage,
  block: null,
});
/**
 * 페이지를 다른 페이지의 블록(blockType :page)으로 변경하는 액션함수
 * @param targetPageId 옮겨지는 페이지
 * @param destinationPageId 페이지가 옮겨질 페이지
 * @returns
 */
export const move_page_to_page = (
  targetPageId: string,
  destinationPageId: string
) => ({
  type: MOVE_PAGE_TO_PAGE,
  pageId: targetPageId,
  destinationPageId: destinationPageId,
  block: null,
});
export const delete_page = (pageId: string) => ({
  type: DELETE_PAGE,
  pageId: pageId,
  block: null,
});
/**
 * 삭제되어 trash에 저장된 page를 다시 notion.pages로 복구하는 액션함수
 * @param pageId
 * @returns
 */
export const restore_page = (pageId: string) => ({
  type: RESTORE_PAGE,
  pageId: pageId,
  block: null,
});
/** trash의 data를 삭제하는 액션함수 */
export const clean_trash = (pageId: string) => ({
  type: CLEAN_TRASH,
  pageId: pageId,
  block: null,
});
/**
 * 새로운 template 을 만드는 액션함수
 * @param
 * @returns
 */
export const add_template = (template: Page) => ({
  type: ADD_TEMPLATE,
  pageId: template.id,
  template: template,
  block: null,
});
/**
 * template의 수정이 있고, 사용자가 수정되기 이전의 template을 저장하기 원하는 경우  template의 date를 이전 상태로 복구하는 액션함수
 * @param templateId 복구대상인 template의 id
 * @returns
 */
export const cancel_edit_template = (templateId: string) => ({
  type: CANCEL_EDIT_TEMPLATE,
  pageId: templateId,
  block: null,
});
/**
 * template를 삭제하는 액션 함수
 * @param templateId 삭제대상인 template의 id
 * @returns
 */
export const delete_template = (templateId: string) => ({
  type: DELETE_TEMPLATE,
  pageId: templateId,
  block: null,
});
// --- action----------->
type NotionAction =
  | ReturnType<typeof add_block>
  | ReturnType<typeof edit_block>
  | ReturnType<typeof change_block_to_page>
  | ReturnType<typeof change_page_to_block>
  | ReturnType<typeof delete_block>
  | ReturnType<typeof change_to_sub>
  | ReturnType<typeof raise_block>
  | ReturnType<typeof add_page>
  | ReturnType<typeof duplicate_page>
  | ReturnType<typeof edit_page>
  | ReturnType<typeof move_page_to_page>
  | ReturnType<typeof delete_page>
  | ReturnType<typeof restore_page>
  | ReturnType<typeof clean_trash>
  | ReturnType<typeof add_template>
  | ReturnType<typeof cancel_edit_template>
  | ReturnType<typeof delete_template>;

const day = [
  "Mon",
  "1",
  "Ths",
  "2",
  "Wed",
  "3",
  "Thr",
  "4",
  "Fri",
  "5",
  "Sat",
  "6",
  "Sun",
];
const blockBgColor = [
  bg_blue,
  "",
  bg_green,
  "",
  bg_yellow,
  "",
  bg_pink,
  "",
  bg_grey,
  "",
  bg_yellow,
  "",
  bg_blue,
];
const todoList = [
  "6AM :🎽 running",
  "9AM:🏥physical checkup",
  "😊 Webtoon re-enactment",
  "8PM: 🛒Buying food ingredients in mart - sale",
  "6PM :🍴 dinner appointment with friend",
  "Dry cleaning at the dry cleaner",
  "house cleaning",
];

const returnTemplateSubBlock = (day: string, index: number) => {
  const num = index / 2;
  const templateBlock: Block = {
    id: `templateSub_${day}`,
    contents: todoList[num],

    firstBlock: false,
    subBlocksId: null,
    parentBlocksId: [`templateBlock_${day}`],
    type: "todo",
    iconType: null,
    icon: null,
    editTime: editTime,
    createTime: JSON.stringify(Date.now()),
    style: basicBlockStyle,
    comments: null,
  };
  return templateBlock;
};

const returnTemplateBlock = (day: string, index: number) => {
  const templateBlock: Block = {
    id: `templateBlock_${day}`,
    contents: `${day}`,

    firstBlock: true,
    subBlocksId: [`templateSub_${day}`],
    parentBlocksId: null,
    type: "h3",
    iconType: null,
    icon: null,
    editTime: editTime,
    createTime: JSON.stringify(Date.now()),
    style: {
      ...basicBlockStyle,
      bgColor: blockBgColor[index],
    },
    comments: null,
  };
  return templateBlock;
};
const templateBlocks = day.map((d: string) => {
  let returnBlock: Block;
  if (day.indexOf(d) % 2 === 0) {
    returnBlock = returnTemplateBlock(d, day.indexOf(d));
  } else {
    returnBlock = {
      ...blockSample,
      id: `empty${d}_${JSON.stringify(Date.now())}`,
    };
  }
  return returnBlock;
});

const templateBlocksId = templateBlocks.map((block: Block) => block.id);
const templateSubBlocks = day.map((d: string) =>
  returnTemplateSubBlock(d, day.indexOf(d))
);
const templateSubBlocksId = day.map((d: string) => `templateSub_${d}`);
//reducer
const template1: Page = {
  id: "template1",
  type: "template",
  header: {
    title: "To Do List ",
    iconType: "emoji",
    icon: EMOJI_ARR[13],
    cover: null,
    comments: null,
  },
  firstBlocksId: templateBlocksId,
  blocks: [...templateBlocks, ...templateSubBlocks],
  blocksId: [...templateBlocksId, ...templateSubBlocksId],
  subPagesId: null,
  parentsId: null,
  editTime: Date.parse("2022-8-23-15:00").toString(),
  createTime: Date.parse("2022-8-23-12:00").toString(),
};
const template2: Page = {
  id: "template2",
  type: "template",
  header: {
    title: "To Do List2 ",
    iconType: "emoji",
    icon: EMOJI_ARR[19],
    cover: null,
    comments: null,
  },
  firstBlocksId: ["template2_block1"],
  blocks: [
    {
      id: `template2_block1`,
      contents: "check meeting",
      firstBlock: true,
      subBlocksId: null,
      parentBlocksId: null,
      type: "todo",
      iconType: null,
      icon: null,
      editTime: editTime,
      createTime: JSON.stringify(Date.now()),
      style: basicBlockStyle,
      comments: null,
    },
  ],
  blocksId: ["template2_block1"],
  subPagesId: null,
  parentsId: null,
  editTime: Date.parse("2022-8-23-15:00").toString(),
  createTime: Date.parse("2022-8-23-12:00").toString(),
};
export const initialNotionState: Notion = {
  pagesId: ["12345", "page1", "page2", "1234", "123", "template1", "template2"],
  firstPagesId: ["12345", "1234", "123"],
  templatesId: ["template1", "template2"],
  pages: [
    {
      ...pageSample,
      id: "page2",
      header: {
        ...pageSample.header,
        iconType: "emoji",
        icon: EMOJI_ARR[8],
        title: "page2",
      },
      editTime: JSON.stringify(Date.parse("2022-5-20-9:00")),
      createTime: JSON.stringify(Date.parse("2022-5-20-9:00")),
      parentsId: ["12345"],
    },
    {
      id: "1234",
      type: "page",
      header: {
        title: "notion2",
        iconType: "emoji",
        icon: EMOJI_ARR[6],
        cover: null,
        comments: null,
      },
      firstBlocksId: null,
      blocks: null,
      blocksId: null,
      subPagesId: null,
      parentsId: null,
      editTime: JSON.stringify(Date.parse("2022-5-13-19:00")),
      createTime: JSON.stringify(Date.parse("2022-5-13-19:00")),
    },
    {
      id: "123",
      type: "page",
      header: {
        title: "notion3",
        iconType: "emoji",
        icon: EMOJI_ARR[31],
        cover: null,
        comments: null,
      },
      firstBlocksId: null,
      blocks: null,
      blocksId: null,
      subPagesId: null,
      parentsId: null,
      editTime: JSON.stringify(Date.parse("2022-5-22-15:00")),
      createTime: JSON.stringify(Date.parse("2022-5-22-15:00")),
    },
    template1,
    template2,
  ],
  trash: {
    pagesId: null,
    pages: null,
  },
};

export default function notion(
  state: Notion = initialNotionState,
  action: NotionAction
): Notion {
  const pagesId = state.pagesId ? [...state.pagesId] : null;
  const firstPagesId = state.firstPagesId ? [...state.firstPagesId] : null;
  const templatesId =
    state.templatesId === null ? null : [...state.templatesId];
  const pages = state.pages ? [...state.pages] : null;
  let trash = {
    pagesId: state.trash.pagesId ? [...state.trash.pagesId] : null,
    pages: state.trash.pages ? [...state.trash.pages] : null,
  };
  const pageIndex: number =
    action.type !== RESTORE_PAGE
      ? (pagesId?.indexOf(action.pageId) as number)
      : (trash.pagesId?.indexOf(action.pageId) as number);
  const targetPage: Page | TrashPage | null =
    action.type !== RESTORE_PAGE
      ? pages
        ? (pages[pageIndex] as Page)
        : null
      : trash.pages
      ? (trash.pages[pageIndex] as TrashPage)
      : null;

  const editBlockData = (index: number, block: Block) => {
    targetPage?.blocks?.splice(index, 1, block);
  };
  const updateParentBlock = (
    subBlock: Block,
    previousBlockId: string | null
  ) => {
    if (subBlock.parentBlocksId && targetPage) {
      //find parentBlock
      const { parentBlockIndex, parentBlock } = findParentBlock(
        targetPage,
        subBlock
      );

      const subBlocksId = parentBlock.subBlocksId;
      if (subBlocksId) {
        const previousBlockIndex =
          previousBlockId === null
            ? -1
            : (subBlocksId.indexOf(previousBlockId) as number);

        subBlocksId.splice(previousBlockIndex + 1, 0, subBlock.id);
      }

      //edit parentBlock
      const editedParentBlock: Block = {
        ...parentBlock,
        subBlocksId: subBlocksId ? subBlocksId : [subBlock.id],
      };
      //update parentBlock
      targetPage?.blocks?.splice(parentBlockIndex, 1, editedParentBlock);
    } else {
      console.error("can't find parentBlocks of this block");
    }
  };

  /**
   * block.firstBlock== true인 block이 삭제될 경우, page의 firstBlocksId 수정하는 함수
   * @param page 현재 페이지
   * @param block 삭제될 block
   */
  const editFirstBlocksId = (page: Page, block: Block) => {
    if (block.firstBlock && page.firstBlocksId) {
      const firstIndex: number = page.firstBlocksId.indexOf(block.id) as number;
      if (block.subBlocksId) {
        if (firstIndex === 0) {
          page.firstBlocksId = [
            ...block.subBlocksId,
            ...page.firstBlocksId?.slice(1),
          ];
        } else {
          const pre = page.firstBlocksId.slice(0, firstIndex);
          if (firstIndex === page.firstBlocksId.length - 1) {
            page.firstBlocksId = pre.concat(block.subBlocksId);
          } else {
            const after = page.firstBlocksId.slice(firstIndex + 1);
            page.firstBlocksId = pre.concat(block.subBlocksId).concat(after);
          }
        }
      }
      if (block.subBlocksId === null) {
        page.firstBlocksId.splice(firstIndex, 1);
      }
    }
  };
  const raiseSubBlock = (page: Page, block: Block, blockDelete: boolean) => {
    if (block.subBlocksId) {

      const subBlocks: Block[] = block.subBlocksId.map((id: string) => {
        const BLOCK = findBlock(page, id).BLOCK;
        return BLOCK;
      });
      subBlocks.forEach((subBlock: Block) => {
        if (subBlock.parentBlocksId) {
          const raisedSubBlock: Block = {
            ...subBlock,
            parentBlocksId: blockDelete
              ? block.parentBlocksId
              : subBlock.parentBlocksId.slice(1),
            firstBlock: blockDelete ? block.firstBlock : false,
            editTime: editTime,
          };
          const index = page.blocksId?.indexOf(subBlock.id) as number;
          editBlockData(index, raisedSubBlock);
          subBlock.subBlocksId && raiseSubBlock(page, subBlock, blockDelete);
        }
      });
    }
  };
  const updateNewParentAndFirstBlocksIdAfterRaise = (
    page: Page,
    block: Block
  ) => {
    const subBlocksId = block.subBlocksId;
    if (subBlocksId && block.parentBlocksId) {
      const { parentBlock, parentBlockIndex } = findParentBlock(page, block);
      let parentSubsId = parentBlock.subBlocksId as string[];
      const index = parentSubsId.indexOf(block.id);
      if (index === 0) {
        parentSubsId = [...subBlocksId];
      } else {
        if (index === parentSubsId.length - 1) {
          parentSubsId = parentSubsId.slice(0, index).concat(subBlocksId);
        } else {
          const pre = parentSubsId.slice(0, index);
          const after = parentSubsId.slice(index + 1);
          parentSubsId = pre.concat(subBlocksId).concat(after);
        }
      }
      const newParentBlock: Block = {
        ...parentBlock,
        subBlocksId: parentSubsId,
        editTime: editTime,
      };
      editBlockData(parentBlockIndex, newParentBlock);
    }
    editFirstBlocksId(page, block);
  };
  const deleteBlockData = (page: Page, block: Block) => {
    const index = page.blocksId?.indexOf(block.id) as number;
    if (block.firstBlock && page.firstBlocksId) {
      const firstIndex = page.firstBlocksId.indexOf(block.id);
      block.firstBlock &&
        firstIndex >= 0 &&
        page.firstBlocksId?.splice(firstIndex, 1);
    }
    page.blocks?.splice(index, 1);
    page.blocksId?.splice(index, 1);
  };
  function addPage(newPage: Page) {
    if (pagesId && pages && firstPagesId) {
      pagesId.push(newPage.id);
      pages.push(newPage);
      if (newPage.parentsId === null) {
        firstPagesId.push(newPage.id);
      } else {
        const parentPage: Page = findPage(
          pagesId,
          pages,
          newPage.parentsId[newPage.parentsId.length - 1]
        );
        const parentPageIndex = pagesId.indexOf(parentPage.id);
        const editedParentPage: Page = {
          ...parentPage,
          subPagesId: parentPage.subPagesId
            ? parentPage.subPagesId.concat(newPage.id)
            : [newPage.id],
        };

        pages.splice(parentPageIndex, 1, editedParentPage);
      }
    }
  }
  if (targetPage && pagesId && pages && firstPagesId) {
    const blockIndex: number = action.block
      ? (pages[pageIndex]?.blocksId?.indexOf(action.block.id) as number)
      : (0 as number);
    switch (action.type) {
      case ADD_BLOCK:
        if (action.newBlockIndex === 0) {
          targetPage.blocks = targetPage.blocks
            ? [action.block, ...targetPage.blocks]
            : [action.block];
          targetPage.blocksId = targetPage.blocksId
            ? [action.block.id, ...targetPage.blocksId]
            : [action.block.id];
        } else {
          targetPage.blocks?.splice(action.newBlockIndex, 0, action.block);
          targetPage.blocksId?.splice(action.newBlockIndex, 0, action.block.id);
        }

        if (action.block.firstBlock) {
          if (targetPage.firstBlocksId) {
            if (action.previousBlockId) {
              const firstIndex = targetPage.firstBlocksId.indexOf(
                action.previousBlockId
              );
              targetPage.firstBlocksId.splice(
                firstIndex + 1,
                0,
                action.block.id
              );
            } else {
              if (action.newBlockIndex === 0) {
                targetPage.firstBlocksId = [
                  action.block.id,
                  ...targetPage.firstBlocksId,
                ];
              } else {
                targetPage.firstBlocksId = targetPage.firstBlocksId.concat(
                  action.block.id
                );
              }
            }
          } else {
            targetPage.firstBlocksId = [action.block.id];
          }
        } else {
          if (action.block.parentBlocksId) {
            updateParentBlock(action.block, action.previousBlockId);
          }
        }

        if (action.block.subBlocksId && action.previousBlockId) {
          const previousBlock = findBlock(
            targetPage,
            action.previousBlockId
          ).BLOCK;
          previousBlock.subBlocksId = null;

          action.block.subBlocksId.forEach((id: string) => {
            const BLOCK = findBlock(targetPage, id).BLOCK;
            const parentIndex = BLOCK.parentBlocksId?.indexOf(
              action.previousBlockId as string
            );
            parentIndex &&
              BLOCK.parentBlocksId?.splice(parentIndex, 1, action.block.id);
          });
        }
        sessionStorage.setItem("newBlock", action.block.id);
        if (action.block.type === "page") {
          const newPage: Page = {
            ...pageSample,
            id: action.block.id,
            parentsId: [targetPage.id],
          };
          addPage(newPage);
          if (action.block.parentBlocksId) {
            const parentPage = findPage(
              pagesId,
              pages,
              action.block.parentBlocksId[0]
            ) as Page;
            const editedParentPage: Page = {
              ...parentPage,
              blocks:
                parentPage.blocks === null
                  ? [action.block]
                  : parentPage.blocks.concat(action.block),
              blocksId:
                parentPage.blocksId === null
                  ? [action.block.id]
                  : parentPage.blocksId?.concat(action.block.id),
              firstBlocksId: parentPage.firstBlocksId
                ? parentPage.firstBlocksId?.concat(action.block.id)
                : [action.block.id],
              subPagesId:
                parentPage.subPagesId === null
                  ? [...blockSample.id]
                  : parentPage.subPagesId.concat([blockSample.id]),
              editTime: editTime,
            };
            editPage(editedParentPage);
          }
        }
        return {
          pages: pages,
          firstPagesId: firstPagesId,
          templatesId: templatesId,
          pagesId: pagesId,
          trash: trash,
        };
      case EDIT_BLOCK:
        editBlockData(blockIndex, action.block);
        return {
          pages: pages,
          firstPagesId: firstPagesId,
          templatesId: templatesId,
          pagesId: pagesId,
          trash: trash,
        };
      case CHANGE_BLOCK_TO_PAGE:
        const changedTypeBlock: Block = {
          ...action.block,
          contents:
            action.block.contents === "" ? "untitle" : action.block.contents,
          type: "page",
          subBlocksId: null,
          editTime: editTime,
        };
        editBlockData(blockIndex, changedTypeBlock);
        let newBlocksId = [blockSample.id];
        let newBlocks = [blockSample];
        let newFirstBlocksId = [blockSample.id];
        let newSubPagesId: string[] | null = null;
        const allSubBlocks = targetPage.blocks?.filter((block: Block) =>
          block.parentBlocksId?.includes(action.block.id)
        );
        if (allSubBlocks && allSubBlocks[0]) {
          newBlocks = allSubBlocks.map((block: Block) => {
            const newParentBlocksId = block.parentBlocksId
              ? block.parentBlocksId.slice(1)
              : null;
            const newBlock: Block = {
              ...block,
              parentBlocksId: newParentBlocksId
                ? newParentBlocksId[0] === undefined
                  ? null
                  : newParentBlocksId
                : null,
              firstBlock:
                newParentBlocksId === null ||
                newParentBlocksId[0] === undefined,
            };
            return newBlock;
          });
          newBlocksId = newBlocks.map((block: Block) => block.id);
          newFirstBlocksId = newBlocks
            .filter((block: Block) => block.firstBlock === true)
            .map((block: Block) => block.id);
          newSubPagesId = newBlocks
            .filter((block: Block) => block.type === "page")
            .map((block: Block) => block.id);
          if (newBlocks[0]) {
            targetPage.blocks = targetPage.blocks
              ? targetPage.blocks.filter(
                  (block: Block) => !newBlocksId.includes(block.id)
                )
              : null;
            targetPage.blocksId = targetPage.blocksId
              ? targetPage.blocksId.filter(
                  (id: string) => !newBlocksId.includes(id)
                )
              : null;
          }
          if (newSubPagesId[0] && targetPage.subPagesId) {
            targetPage.subPagesId = targetPage.subPagesId.filter(
              (id: string) => !newSubPagesId?.includes(id)
            );
          }
        }

        const title = changedTypeBlock.contents.includes("<span")
          ? getBlockText(action.block)
          : changedTypeBlock.contents;
        const newPage: Page = {
          id: changedTypeBlock.id,
          type: "page",
          header: {
            title: title,
            iconType: changedTypeBlock.iconType,
            icon: changedTypeBlock.icon,
            cover: null,
            comments: changedTypeBlock.comments,
          },
          firstBlocksId: newFirstBlocksId,
          blocksId: newBlocksId,
          blocks: newBlocks,
          subPagesId:
            newSubPagesId === null
              ? null
              : newSubPagesId[0] === undefined
              ? null
              : newSubPagesId,
          parentsId: [action.pageId],
          editTime: changedTypeBlock.editTime,
          createTime: changedTypeBlock.createTime,
        };
        addPage(newPage);
        return {
          pages: pages,
          firstPagesId: firstPagesId,
          templatesId: templatesId,
          pagesId: pagesId,
          trash: trash,
        };
      case CHANGE_PAGE_TO_BLOCK:
        const changedTargetPageIndex = pagesId.indexOf(action.block.id);
        const changedTargetPage = pages[changedTargetPageIndex];
        deleteTargetPageData(
          pagesId,
          pages,
          firstPagesId,
          changedTargetPage,
          changedTargetPageIndex,
          false
        );
        const changedBlock: Block = {
          ...action.block,
          subBlocksId: changedTargetPage.blocksId,
          editTime: editTime,
        };
        editBlockData(blockIndex, changedBlock);
        if (
          changedTargetPage.blocks &&
          changedTargetPage.blocksId &&
          targetPage.blocks &&
          targetPage.blocksId
        ) {
          // targetPage에 changedTargetPage의 block들을 추가
          const newParentBlocksId = action.block.parentBlocksId
            ? action.block.parentBlocksId.concat(action.block.id)
            : [action.block.id];
          const newSubBlocks: Block[] = changedTargetPage.blocks.map(
            (block: Block) => ({
              ...block,
              firstBlock: false,
              parentBlocksId: block.parentBlocksId
                ? newParentBlocksId.concat(action.block.id)
                : newParentBlocksId,
            })
          );
          const newTargetPageBlocks = targetPage.blocks.concat(newSubBlocks);
          const newTargetPlageBlocksId = targetPage.blocksId.concat(
            changedTargetPage.blocksId
          );
          const editedTargetPage: Page = {
            ...targetPage,
            blocks: newTargetPageBlocks,
            blocksId: newTargetPlageBlocksId,
            editTime: editTime,
          };
          editPage(editedTargetPage);
        }
        return {
          pages: pages,
          firstPagesId: firstPagesId,
          templatesId: templatesId,
          pagesId: pagesId,
          trash: trash,
        };
      case CHANGE_TO_SUB_BLOCK:
        //1. change  action.block's new parentBlock
        const { BLOCK, index } = findBlock(targetPage, action.newParentBlockId);
        const parentBlock: Block = {
          ...BLOCK,
          subBlocksId: BLOCK.subBlocksId
            ? BLOCK.subBlocksId.concat(action.block.id)
            : [action.block.id],
          editTime: editTime,
        };
        const parentBlockIndex = index;
        editBlockData(parentBlockIndex, parentBlock);

        //2. change action.block to subBlock : edit parentsId of action.block
        const editedBlock: Block = {
          ...action.block,
          firstBlock: false,
          parentBlocksId: parentBlock.parentBlocksId
            ? parentBlock.parentBlocksId.concat(parentBlock.id)
            : [parentBlock.id],
          editTime: editTime,
        };
        editBlockData(blockIndex, editedBlock);
        // 3. first-> sub 인 경우
        if (action.block.firstBlock) {
          // delete  id from firstBlocksId
          const index: number = targetPage.firstBlocksId?.indexOf(
            action.block.id
          ) as number;
          targetPage.firstBlocksId?.splice(index, 1);
        }
        // 4. action.block의 subBlock 에서 다른 subBlock 으로 변경되었을 경우
        if (action.block.parentBlocksId) {
          const previousParentBlockId =
            action.block.parentBlocksId[action.block.parentBlocksId.length - 1];
          const { BLOCK, index } = findBlock(targetPage, previousParentBlockId);
          const editedPreviousParentBlock: Block = {
            ...BLOCK,
            subBlocksId: BLOCK.subBlocksId
              ? BLOCK.subBlocksId.filter((id: string) => id !== action.block.id)
              : null,
            editTime: editTime,
          };
          editBlockData(index, editedPreviousParentBlock);
        }
        return {
          pages: pages,
          firstPagesId: firstPagesId,
          templatesId: templatesId,
          pagesId: pagesId,
          trash: trash,
        };

      case RAISE_BLOCK:
        
        if (
          targetPage.firstBlocksId &&
          targetPage.firstBlocksId[0] !== action.block.id &&
          targetPage.blocks &&
          targetPage.blocksId
        ) {
          const targetBlock = action.block;
          const { previousBlockInDoc, previousBlockInDocIndex } =
            findPreviousBlockInDoc(targetPage, action.block);
          
          const combineContents = (
            parentBlock: Block | null,
            parentBlockIndex: number | null
          ) => {
            const editedPreBlockInDoc: Block = {
              ...previousBlockInDoc,
              contents: `${previousBlockInDoc.contents}${targetBlock.contents}`,
              editTime: editTime,
            };

            if (parentBlockIndex && parentBlock && parentBlock.subBlocksId) {
              const newSubBlocksId = parentBlock.subBlocksId.filter(
                (id: string) => id !== targetBlock.id
              );

              const newParentBlock: Block = {
                ...parentBlock,
                subBlocksId:
                  newSubBlocksId[0] === undefined ? null : newSubBlocksId,
                editTime: editTime,
              };
              if (parentBlock.id === previousBlockInDoc.id) {
                const newParentBlockAlsoPreviousBlock: Block = {
                  ...newParentBlock,
                  contents: editedPreBlockInDoc.contents,
                };
                editBlockData(
                  parentBlockIndex,
                  newParentBlockAlsoPreviousBlock
                );
              } else {
                editBlockData(previousBlockInDocIndex, editedPreBlockInDoc);
                editBlockData(parentBlockIndex, newParentBlock);
              }
            } else {
              editBlockData(previousBlockInDocIndex, editedPreBlockInDoc);
            }
            targetPage.blocks?.splice(blockIndex, 1);
            targetPage.blocksId?.splice(blockIndex, 1);

            raiseSubBlock(targetPage, action.block, true);
            updateNewParentAndFirstBlocksIdAfterRaise(targetPage, action.block);
            
          };
          
          const pullBlock = (
            subBlocksId: string[],
            targetBlockIndexInSubBlocks: number,
            parentBlock: Block,
            parentBlockIndex: number
          ) => {
            raiseSubBlock(targetPage, action.block, false);
            const editedTargetBlock: Block = {
              ...targetBlock,
              parentBlocksId: parentBlock.parentBlocksId,
              firstBlock: parentBlock.firstBlock,
              editTime: editTime,
            };
            editBlockData(blockIndex, editedTargetBlock);
            subBlocksId.splice(targetBlockIndexInSubBlocks, 1);
            const editedParentBlock: Block = {
              ...parentBlock,
              subBlocksId: subBlocksId[0] === undefined ? null : subBlocksId,
              editTime: editTime,
            };
            editBlockData(parentBlockIndex, editedParentBlock);
            //edit firstBlock
            if (parentBlock.firstBlock && targetPage.firstBlocksId) {
              const firstIndex = targetPage.firstBlocksId.indexOf(
                parentBlock.id
              );
              targetPage.firstBlocksId.splice(
                firstIndex + 1,
                0,
                targetBlock.id
              );
            }

            if (parentBlock.parentBlocksId) {
              const grandParentBlockId =
                parentBlock.parentBlocksId[
                  parentBlock.parentBlocksId.length - 1
                ];
              const { BLOCK, index } = findBlock(
                targetPage,
                grandParentBlockId
              );
              const grandParentBlock = BLOCK;
              const grandParentBlockIndex = index;
              if (grandParentBlock.subBlocksId) {
                const grandSubsId = [...grandParentBlock.subBlocksId];
                const subIndex = grandSubsId.indexOf(parentBlock.id);
                grandSubsId.splice(subIndex + 1, 0, targetBlock.id);
                const newGrandParentBlock: Block = {
                  ...grandParentBlock,
                  subBlocksId: grandSubsId,
                  editTime: editTime,
                };
                editBlockData(grandParentBlockIndex, newGrandParentBlock);
              }
            }
          };
          //
          if (targetBlock.firstBlock) {
            //combine -case1
            combineContents(null, null);
          } else {
            const { parentBlock, parentBlockIndex } = findParentBlock(
              targetPage,
              targetBlock
            );
            if (parentBlock.subBlocksId) {
              /**
               * parentBlock.subBlocksId를 복사한 것
               */
              const subBlocksId = [...parentBlock.subBlocksId];
              const targetBlockIndexInSubBlocks = subBlocksId.indexOf(
                targetBlock.id
              );

              if (targetBlockIndexInSubBlocks < subBlocksId.length - 1) {
                //combine -case2
                combineContents(parentBlock, parentBlockIndex);
              } else {
                //pull
                pullBlock(
                  subBlocksId,
                  targetBlockIndexInSubBlocks,
                  parentBlock,
                  parentBlockIndex
                );
              }
            }
          }
        }
        return {
          pages: pages,
          firstPagesId: firstPagesId,
          templatesId: templatesId,
          pagesId: pagesId,
          trash: trash,
        };

      case DELETE_BLOCK:
        if (
          action.block.parentBlocksId &&
          targetPage.blocks &&
          targetPage.blocksId
        ) {
          const parentBlocksId = action.block?.parentBlocksId as string[];
          const parentBlockId: string =
            parentBlocksId[parentBlocksId.length - 1];
          const parentBlockIndex = targetPage.blocksId.indexOf(parentBlockId);
          const parentBlock = targetPage.blocks[parentBlockIndex];
          const newSubBlocksId = parentBlock.subBlocksId?.filter(
            (id: string) => id !== action.block.id
          ) as string[];
          if (newSubBlocksId[0]) {
            editBlockData(parentBlockIndex, {
              ...parentBlock,
              subBlocksId: newSubBlocksId,
            });
          } else {
            if (action.block.type.includes("List")) {
              deleteBlockData(targetPage, parentBlock);
            } else {
              editBlockData(parentBlockIndex, {
                ...parentBlock,
                subBlocksId: null,
              });
            }
          }
        }
        // 삭제 타깃인 block 이 subBlock을 가지는 경우 ....
        if (action.isInMenu) {
          deleteBlockData(targetPage, action.block);
        } else {
          raiseSubBlock(targetPage, action.block, true);

          editFirstBlocksId(targetPage, action.block);
          targetPage.blocks?.splice(blockIndex, 1);
          targetPage.blocksId?.splice(blockIndex, 1);
        }
        if (action.block.type === "page") {
          deletePage(action.block.id, false);
        }
        return {
          pages: pages,
          firstPagesId: firstPagesId,
          templatesId: templatesId,
          pagesId: pagesId,
          trash: trash,
        };

      case DUPLICATE_PAGE:
        const targetPageIndex = pagesId.indexOf(targetPage.id);
        const nextPageId = pagesId[targetPageIndex + 1];
        const nextPage: Page = findPage(pagesId, pages, nextPageId);
        let number: string = "1";
        let stop: boolean = false;
        if (nextPage.header.title === `${targetPage.header.title}(1)`) {
          const slicedPages = pages.slice(targetPageIndex + 1);
          for (let i = 0; i < slicedPages.length && !stop; i++) {
            const title = slicedPages[i].header.title;
            if (title === `${targetPage.header.title}(${i + 1})`) {
              number = (i + 2).toString();
            } else {
              stop = true;
            }
          }
        }
        const duplicatedNewPage: Page = {
          ...targetPage,
          id: `${targetPage.id}_duplicate_${number}`,
          header: {
            ...targetPage.header,
            title: `${targetPage.header.title}(${number})`,
          },
          editTime: editTime,
        };
        if (targetPage.parentsId === null) {
          const index = firstPagesId.indexOf(targetPage.id);
          firstPagesId.splice(index + 1, 0, duplicatedNewPage.id);
        } else {
          const parentPage = {
            ...findPage(
              pagesId,
              pages,
              targetPage.parentsId[targetPage.parentsId.length - 1]
            ),
          };
          const parentPageIndex = pagesId.indexOf(parentPage.id);
          const subPageIndex = parentPage.subPagesId?.indexOf(
            targetPage.id
          ) as number;
          parentPage.subPagesId?.splice(subPageIndex, 0, duplicatedNewPage.id);

          pages.splice(parentPageIndex, 0, parentPage);
        }
        pages.splice(targetPageIndex + 1, 0, duplicatedNewPage);
        pagesId.splice(targetPageIndex + 1, 0, duplicatedNewPage.id);
        return {
          pages: pages,
          firstPagesId: firstPagesId,
          templatesId: templatesId,
          pagesId: pagesId,
          trash: trash,
        };

      case EDIT_PAGE:
        function editPage(newPage: Page) {
          if (pagesId && pages) {
            const parentsId = newPage.parentsId;
            if (parentsId) {
              const parentPageId = parentsId[parentsId.length - 1];
              const parentPage = findPage(pagesId, pages, parentPageId);
              if (parentPage.blocks && parentPage.blocksId) {
                const blockIndex = parentPage.blocksId.indexOf(newPage.id);
                const pageBlock = parentPage.blocks[blockIndex];
                const editedPageBlock: Block = {
                  ...pageBlock,
                  contents: newPage.header.title,
                  icon: newPage.header.icon,
                  editTime: editTime,
                };
                parentPage.blocks.splice(blockIndex, 1, editedPageBlock);
              }
            }
            const pageIndex = pagesId.indexOf(newPage.id);
            pages.splice(pageIndex, 1, newPage);
          }
        }
        editPage(action.newPage);

        return {
          pages: pages,
          firstPagesId: firstPagesId,
          templatesId: templatesId,
          pagesId: pagesId,
          trash: trash,
        };
      case MOVE_PAGE_TO_PAGE:
        /**
         * 이동의 대상인 page
         */
        const moveTargetPage = findPage(pagesId, pages, action.pageId);
        const moveTargetPageIndex = pagesId.indexOf(action.pageId);
        const destinationPageId = action.destinationPageId;
        /**
         * 이동의 목적지인 page
         */
        const destinationPage = findPage(pagesId, pages, destinationPageId);
        const destinationPageIndex = pagesId.indexOf(destinationPage.id);
        // editedMoveTargetPage : 이동으로 인해 데이터가 변경된 moveTargetPage
        const editedMoveTargetPage: Page = {
          ...moveTargetPage,
          parentsId: [destinationPageId],
          editTime: editTime,
        };
        pages.splice(moveTargetPageIndex, 1, editedMoveTargetPage);
        // notion의 firstPagesId 변경
        if (firstPagesId.includes(editedMoveTargetPage.id)) {
          const index = firstPagesId.indexOf(editedMoveTargetPage.id);
          firstPagesId.splice(index, 1);
        }
        // targetPage의 subPage의 parentsId 변경
        /**
         * 페이지가 다른 페이지의 subPage로 이동함에 따라 해당page에 있는 subPage들의 parentsId를 수정하는 함수
         * @param pageId subPage의 id
         */
        const changeParentsId = (pageId: string) => {
          const subPage = findPage(pagesId, pages, pageId) as Page;
          const subPageIndex = pagesId.indexOf(pageId);
          if (subPage.parentsId) {
            const targetPageIndex = subPage.parentsId.indexOf(action.pageId);
            const remainPagesId = subPage.parentsId.slice(targetPageIndex);
            const newParentPagesId = [destinationPageId, ...remainPagesId];
            const editedSubPage: Page = {
              ...subPage,
              parentsId: newParentPagesId,
              editTime: editTime,
            };
            pages.splice(subPageIndex, 1, editedSubPage);
            if (subPage.subPagesId) {
              subPage.subPagesId.forEach((subPageId: string) =>
                changeParentsId(subPageId)
              );
            }
          }
        };
        if (editedMoveTargetPage.subPagesId) {
          editedMoveTargetPage.subPagesId.forEach((subPageId: string) =>
            changeParentsId(subPageId)
          );
        }
        let pageBlockStyle: BlockStyle = basicBlockStyle;

        // 페이지 이동전, targetPage가 들어 있는 page에서 targetPage에 대한 데이터 삭제 :block 삭제, subPages 삭제
        if (moveTargetPage.parentsId) {
          /**
           * 이동 전에 targetPage가 들어있는 page
           */
          const parentPage = findPage(
            pagesId,
            pages,
            moveTargetPage.parentsId[moveTargetPage.parentsId.length - 1]
          );
          if (
            parentPage.blocks &&
            parentPage.blocksId &&
            parentPage.firstBlocksId &&
            parentPage.subPagesId
          ) {
            const blockIndex = parentPage.blocksId.indexOf(action.pageId);
            const pageBlock = parentPage.blocks[blockIndex];
            const firstBlocksId = [...parentPage.firstBlocksId];
            const subPagesId = [...parentPage.subPagesId];
            //parentPage의 firstBlock 수정
            if (pageBlock.firstBlock) {
              const indexAsFirst = firstBlocksId.indexOf(pageBlock.id);
              parentPage.firstBlocksId.splice(indexAsFirst, 1);
              //firstBlocksId.splice(indexAsFirst,1);
            }
            //pageBlock의 parentBlock을 수정
            if (pageBlock.parentBlocksId) {
              const { parentBlock, parentBlockIndex } = findParentBlock(
                parentPage,
                pageBlock
              );
              const subIndex = parentBlock.subBlocksId?.indexOf(
                pageBlock.id
              ) as number;
              const subBlocksId = [...(parentBlock.subBlocksId as string[])];
              subBlocksId.splice(subIndex, 1);
              const editedParentBlock: Block = {
                ...parentBlock,
                subBlocksId: subBlocksId,
                editTime: editTime,
              };
              parentPage.blocks.splice(parentBlockIndex, 1, editedParentBlock);
            }
            //parentPage에서 pageBlock 삭제 , subPagesId에서 moveTargetPage 삭제
            parentPage.blocks.splice(blockIndex, 1);
            parentPage.blocksId.splice(blockIndex, 1);
            const subPageIndex = subPagesId.indexOf(moveTargetPage.id);
            parentPage.subPagesId.splice(subPageIndex, 1);
            pageBlockStyle = pageBlock.style;
          }
        }

        //destination page 관련 변경
        /**
         * 다른 page(destination page)로 이동 시 , targetPage는  그 페이지의 page type block으로 추가되는데 그때 추가되는 block
         */
        const newPageBlock: Block = {
          id: editedMoveTargetPage.id,
          contents: editedMoveTargetPage.header.title,

          firstBlock: true,
          subBlocksId: null,
          parentBlocksId: null,
          type: "page",
          iconType: editedMoveTargetPage.header.iconType,
          icon: editedMoveTargetPage.header.icon,
          editTime: editedMoveTargetPage.editTime,
          createTime: editedMoveTargetPage.createTime,
          style: pageBlockStyle,
          comments: editedMoveTargetPage.header.comments,
        };
        /**
         * page가 이동됨에 따라 데이터가 변경된 destinationPage
         */
        const editedDestinationPage: Page = {
          ...destinationPage,
          editTime: editTime,
          firstBlocksId: destinationPage.firstBlocksId
            ? destinationPage.firstBlocksId.concat(newPageBlock.id)
            : [newPageBlock.id],
          blocks: destinationPage.blocks
            ? destinationPage.blocks.concat(newPageBlock)
            : [newPageBlock],
          blocksId: destinationPage.blocksId
            ? destinationPage.blocksId.concat(newPageBlock.id)
            : [newPageBlock.id],
          subPagesId: destinationPage.subPagesId
            ? destinationPage.subPagesId.concat(editedMoveTargetPage.id)
            : [editedMoveTargetPage.id],
        };
        pages.splice(destinationPageIndex, 1, editedDestinationPage);
        return {
          pages: pages,
          firstPagesId: firstPagesId,
          templatesId: templatesId,
          pagesId: pagesId,
          trash: trash,
        };
      case DELETE_PAGE:
        function deleteTargetPageData(
          pagesId: string[],
          pages: Page[],
          firstPagesId: string[],
          deletedTargetPage: Page,
          deletedTargetPageIndex: number,
          blockDelete: boolean
        ) {
          if (deletedTargetPage.parentsId) {
            const parentPageIndex = pagesId.indexOf(
              deletedTargetPage.parentsId[
                deletedTargetPage.parentsId.length - 1
              ]
            );
            const parentPage = pages[parentPageIndex];
            if (parentPage.subPagesId) {
              const subPageIndex = parentPage.subPagesId.indexOf(
                deletedTargetPage.id
              );
              parentPage.subPagesId.splice(subPageIndex, 1);
              if (blockDelete && parentPage.blocksId && parentPage.blocks) {
                const blockIndex = parentPage.blocksId.indexOf(
                  deletedTargetPage.id
                );
                const pageBlock = parentPage.blocks[blockIndex];
                parentPage.blocks.splice(blockIndex, 1);
                parentPage.blocksId.splice(blockIndex, 1);
                const firstBlocKIndex = parentPage.firstBlocksId?.indexOf(
                  pageBlock.id
                );
                if (firstBlocKIndex) {
                  if (firstBlocKIndex > -1) {
                    parentPage.firstBlocksId?.splice(firstBlocKIndex, 1);
                  } else {
                    const { parentBlock, parentBlockIndex } = findParentBlock(
                      parentPage,
                      pageBlock
                    );
                    const newParentBlock: Block = {
                      ...parentBlock,
                      subBlocksId:
                        parentBlock.subBlocksId === null
                          ? null
                          : parentBlock.subBlocksId.filter(
                              (id: string) => id !== pageBlock.id
                            ),
                      editTime: editTime,
                    };
                    parentPage.blocks.splice(
                      parentBlockIndex,
                      1,
                      newParentBlock
                    );
                  }
                }
              }
            }
          } else {
            //firstPage 일 경우
            const index = firstPagesId.indexOf(deletedTargetPage.id);
            firstPagesId.splice(index, 1);
          }
          pages.splice(deletedTargetPageIndex, 1);
          pagesId.splice(deletedTargetPageIndex, 1);
        }

        function deletePage(pageId: string, blockDelete: boolean) {
          if (pagesId && pages && firstPagesId) {
            const deletedTargetPageIndex = pagesId.indexOf(pageId);
            const deletedTargetPage = pages[deletedTargetPageIndex];

            deleteTargetPageData(
              pagesId,
              pages,
              firstPagesId,
              deletedTargetPage,
              deletedTargetPageIndex,
              blockDelete
            );
            let trashTargetPage: TrashPage = {
              ...deletedTargetPage,
              subPages: null,
            };
            if (deletedTargetPage.subPagesId) {
              const subPages: Page[] = deletedTargetPage.subPagesId.map(
                (id: string) => findPage(pagesId, pages, id)
              );
              trashTargetPage = {
                ...deletedTargetPage,
                subPages: subPages,
              };
              deletedTargetPage.subPagesId.forEach((id: string) => {
                const index = pagesId.indexOf(id);
                pages.splice(index, 1);
                pagesId.splice(index, 1);
              });
            }
            trash = {
              pagesId:
                trash.pagesId === null
                  ? [deletedTargetPage.id]
                  : trash.pagesId.concat(deletedTargetPage.id),
              pages:
                trash.pages === null
                  ? [trashTargetPage]
                  : trash.pages.concat(trashTargetPage),
            };
          }
        }
        deletePage(action.pageId, true);
        return {
          pages: pages,
          firstPagesId: firstPagesId,
          templatesId: templatesId,
          pagesId: pagesId,
          trash: trash,
        };
      case CANCEL_EDIT_TEMPLATE:
        const restorePage = (item: string) => {
          const sessionItem = sessionStorage.getItem(item);
          if (sessionItem) {
            const originTemplate: Page = JSON.parse(sessionItem);
            const templateIndexInPages = pagesId.indexOf(originTemplate.id);
            pages.splice(templateIndexInPages, 1, originTemplate);
            sessionStorage.removeItem(item);
          }
        };
        restorePage("originTemplate");
        restorePage("originMoveTargetPage");
        return {
          pages: pages,
          firstPagesId: firstPagesId,
          templatesId: templatesId,
          pagesId: pagesId,
          trash: trash,
        };
      case DELETE_TEMPLATE:
        const templateIndexInPages = pagesId.indexOf(`${action.pageId}`);
        pages.splice(templateIndexInPages, 1);
        pagesId.splice(templateIndexInPages, 1);
        if (templatesId) {
          const templateIndexInTemplates = templatesId.indexOf(
            `${action.pageId}`
          );
          templatesId.splice(templateIndexInTemplates, 1);
        }
        return {
          pages: pages,
          firstPagesId: firstPagesId,
          templatesId: templatesId
            ? templatesId[0] === undefined
              ? null
              : templatesId
            : templatesId,
          pagesId: pagesId,
          trash: trash,
        };
    }
  }
  switch (action.type) {
    case ADD_PAGE:
      let pageArr = pages ? [...pages] : null;
      let pageIdArr = pagesId ? [...pagesId] : null;
      let firstPageIdArr = firstPagesId ? [...firstPagesId] : null;

      if (pagesId && pages && firstPagesId) {
        addPage(action.newPage);
      } else {
        pageArr = [action.newPage];
        pageIdArr = [action.newPage.id];
        firstPageIdArr = [action.newPage.id];
      }
      return {
        pages: pages ? pages : pageArr,
        firstPagesId: firstPagesId ? firstPagesId : firstPageIdArr,
        templatesId: templatesId,
        pagesId: pagesId ? pagesId : pageIdArr,
        trash: trash,
      };

    case RESTORE_PAGE:
      let trashPages = trash.pages === null ? null : [...trash.pages];
      let trashPagesId = trash.pagesId === null ? null : [...trash.pagesId];

      const restoredPage: Page = {
        ...(targetPage as Page),
        editTime: editTime,
        parentsId: null,
      };

      if (trashPages && trashPagesId) {
        const trashTargetPage = findPage(
          trashPagesId,
          trashPages,
          action.pageId
        ) as TrashPage;
        const trashTargetPageIndex = trashPagesId.indexOf(trashTargetPage.id);
        trashPages.splice(trashTargetPageIndex, 1);
        trashPagesId.splice(trashTargetPageIndex, 1);
        if (trashTargetPage.subPages) {
          trashTargetPage.subPages.forEach((sub: Page) => {
            pageArr?.push(sub);
            pageIdArr?.push(sub.id);
          });
        }
      }
      const newNotion: Notion = {
        ...state,
        pages: pages === null ? [restoredPage] : [...pages, restoredPage],
        pagesId:
          pagesId === null ? [restoredPage.id] : [...pagesId, restoredPage.id],
        firstPagesId:
          firstPagesId === null
            ? [restoredPage.id]
            : [...firstPagesId, restoredPage.id],
        trash:
          trashPages?.[0] && trashPagesId?.[0]
            ? {
                pages: [...trashPages],
                pagesId: [...trashPagesId],
              }
            : {
                pages: null,
                pagesId: null,
              },
      };
      return newNotion;
    case CLEAN_TRASH:
      trash.pages?.splice(pageIndex, 1);
      trash.pagesId?.splice(pageIndex, 1);
      const cleanedTrash = {
        pages: trash.pages?.[0] ? trash.pages : null,
        pagesId: trash.pagesId?.[0] ? trash.pagesId : null,
      };
      return {
        ...state,
        trash: cleanedTrash,
      };

    case ADD_TEMPLATE:
      const newTemplate = action.template;

      return {
        pages: pages ? pages.concat(newTemplate) : [newTemplate],
        firstPagesId: firstPagesId,
        templatesId: templatesId
          ? templatesId.concat(newTemplate.id)
          : [newTemplate.id],
        pagesId: pagesId ? pagesId.concat(newTemplate.id) : [newTemplate.id],
        trash: trash,
      };

    default:
      return state;
  }
}

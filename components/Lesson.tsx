import React, { PropsWithChildren } from "react";
import { useDispatch, useSelector } from "react-redux";
import { switchLessonPage } from "../playground/actions";
import Fundraising from "./Fundraising";

import LessonHeader from "./LessonHeader";
import NoScriptBar from "./NoScriptBar";
import ProgressBar, { ProgressPage } from "./ProgressBar";

export interface LessonProps {
  // Unit that this lesson belongs to
  module: string;
  badges?: Array<string>;
}

const getElemPosition = (element) => {
  let top = 0;
  do {
    top += element.offsetTop || 0;
    element = element.offsetParent;
  } while (element);
  return top;
};

const scrollToElem = (elem) => {
  console.log(elem, getElemPosition(elem));
  window.scrollTo({ top: getElemPosition(elem), behavior: "smooth" });
};

const Lesson: React.FunctionComponent<PropsWithChildren<LessonProps>> = (
  props: PropsWithChildren<LessonProps>
) => {
  const dispatch = useDispatch();
  const currentPage = useSelector((state: any) =>
    parseInt(state.navigation.lessonPage, 10)
  );

  const onSwitchPage = (page) => {
    dispatch(switchLessonPage(page));
    setTimeout(() => {
      scrollToElem(document.getElementById("module_header"));
    }, 50);
  };

  const pagesTitles = [];

  const pages = React.Children.map(props.children, (page, index) => {
    if (React.isValidElement(page)) {
      pagesTitles.push(page.props.title);
      return React.cloneElement(page, {
        isCurrent: currentPage == index + 1,
      });
    }
    return page;
  });

  return (
    <>
      <LessonHeader
        module={props.module}
        title={pagesTitles[currentPage - 1]}
        badges={props.badges}
      />
      <NoScriptBar />
      {pages}
      <div className="row no-gutters lesson_text">
        <div className="col-12" id="lesson-navigation">
          <ProgressBar onSwitchPage={onSwitchPage} currentPage={currentPage}>
            {pagesTitles.map((page, index) => (
              <ProgressPage key={index} page={index + 1}>
                {page}
              </ProgressPage>
            ))}
          </ProgressBar>
        </div>
      </div>
      <Fundraising />
    </>
  );
};

export default Lesson;

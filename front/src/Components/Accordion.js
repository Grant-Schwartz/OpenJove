import React from 'react';
import 'Styles/Accordion.css';

export const AccordionItem = ({ label, isCollapsed, handleClick, children }) => {
    return (
      <>
        <button className={`accordion-button ${isCollapsed ? 'collapsed' : 'expanded'}`} onClick={handleClick}>
          {label}
        </button>
        <div
          className={`accordion-item ${isCollapsed ? 'collapsed' : 'expanded'}`}
          aria-expanded={isCollapsed}
        >
          {children}
        </div>
      </>
    );
  };

export const Accordion = (props) => {
    const { defaultIndex, onItemClick, children } = props;
    const [bindIndex, setBindIndex] = React.useState(defaultIndex);
  
    const changeItem = itemIndex => {
      if (typeof onItemClick === 'function') onItemClick(itemIndex);
      if (itemIndex !== bindIndex) setBindIndex(itemIndex);
    };
    const items = children.filter(item => item.type.name === 'AccordionItem');
  
    return (
      <div {...props}>
        {items.map(({ props }) => (
          <AccordionItem
            isCollapsed={bindIndex !== props.index}
            label={props.label}
            handleClick={() => changeItem(props.index)}
            children={props.children}
          />
        ))}
      </div>
    );
  };
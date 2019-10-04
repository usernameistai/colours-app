import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import DraggableColorBox from './DraggableColorBox';


const DraggableColorList = SortableContainer(({colors, removeColor}) => { // grab colors from props
  return (
    <div style={{height: "100%"}}>
      {colors.map((color, i) => ( // need an index from dragging and dropping
        <DraggableColorBox 
          index={i}
          key={color.name}
          color={color.color} 
          name={color.name} 
          handleClick={() => removeColor(color.name)}
        />
      ))}
    </div>
  );
});

export default DraggableColorList; 
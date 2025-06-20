import React from "react";

interface ListProps {
  items: string[];
  variant?: "default" | "bordered" | "spaced";
}

const List: React.FC<ListProps> = ({ items, variant = "default" }) => {
  const getListClass = () => {
    let baseClass = "list";
    if (variant === "bordered") baseClass += " list--bordered";
    if (variant === "spaced") baseClass += " list--spaced";
    return baseClass;
  };

  return (
    <ul className={getListClass()}>
      {items.map((item, index) => (
        <li key={index} className="list__item">
          {item}
        </li>
      ))}
    </ul>
  );
};

export default List;

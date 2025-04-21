export default function Panel({ header, children }) {
    return (
      <div className="ais-Panel">
        <div className="ais-Panel-header">{header}</div>
        <div className="ais-Panel-body">{children}</div>
      </div>
    );
  }
import React from "react";
import throttle from "lodash/throttle";
const events = new Set();
//const onResize = () => events.forEach((fn: any) => fn());

const useWindowSize = (options: { [key: string]: any } = {}) => {
    const { throttleMs = 1000 } = options;
    const [size, setSize] = React.useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    const handle = throttle(() => {
        setSize({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }, throttleMs);

    React.useEffect(() => {
        if (events.size === 0) {
            //window.addEventListener("resize", onResize, true);
        }

        events.add(handle);

        return () => {
            events.delete(handle);

            if (events.size === 0) {
                //window.removeEventListener("resize", onResize, true);
            }
        };
    }, [handle]);

    return size;
};

export default useWindowSize;

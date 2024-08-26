'use client';
import { useWindowSize } from '@react-hook/window-size';
import { motion, MotionValue, useSpring, useTransform } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import { useRafLoop } from 'react-use';

/**
 * @see https://14islands.com/blog/interactive-marquee-with-framer-motion/
 *
 * @see https://codesandbox.io/s/x3r465?file=/src/App.js
 */

type MarqueeItemProps = {
    children: React.ReactNode;
    speed: MotionValue<any>;
};

const MarqueeItem: React.FC<MarqueeItemProps> = (props) => {
    const { children, speed } = props;

    const itemRef = useRef<HTMLDivElement>(null);
    const rectRef = useRef<DOMRect | null>(null);
    const x = useRef(0);
    const [width, height] = useWindowSize();

    const setX = () => {
        if (!itemRef.current || !rectRef.current) {
            return;
        }

        const xPercentage = (x.current / rectRef.current.width) * 100;

        if (xPercentage < -100) {
            x.current = 0;
        }

        if (xPercentage > 0) {
            x.current = -rectRef.current.width;
        }

        itemRef.current.style.transform = `translate3d(${xPercentage}%, 0, 0)`;
    };

    useEffect(() => {
        if (itemRef.current) {
            rectRef.current = itemRef.current.getBoundingClientRect();
        }
    }, [width, height]);

    const loop = () => {
        //Substracts the current x from the speed set by useSpring
        x.current -= speed.get();
        setX();
    };

    const [_, loopStart] = useRafLoop(loop, false);

    useEffect(() => {
        loopStart();
    }, []);

    return (
        <motion.div className='item' ref={itemRef}>
            {children}
        </motion.div>
    );
};

type MarqueeProps = {
    speed?: number;
    threshold?: number;
    wheelFactor?: number;
    dragFactor?: number;
    rotate?: number;
    className?: string;
    children: React.ReactNode;
};

export const InteractiveMarquee: React.FC<MarqueeProps> = (props) => {
    const {
        speed = 0,
        threshold = 0.014,
        wheelFactor = 1.8,
        dragFactor = 1.2,
        children,
        rotate = 0,
        className = 'fixed top-0 left-0 w-full h-full',
    } = props;

    const marqueeRef = useRef<HTMLDivElement>(null);
    const slowDown = useRef(false);
    const isScrolling = useRef<NodeJS.Timeout | null>(null);
    const constraintsRef = useRef<HTMLDivElement>(null);

    const x = useRef(0);
    const [wWidth] = useWindowSize();
    const speedSpring = useSpring(speed, {
        damping: 40,
        stiffness: 90,
        mass: 5,
    });

    const opacity = useTransform(speedSpring, [-wWidth * 0.05, 0, wWidth * 0.05], [1, 0, 1]);
    const skewX = useTransform(speedSpring, [-wWidth * 0.05, 0, wWidth * 0.05], [1, 0, 1]);

    const loop = () => {
        /**
         * Do nothing if we're slowing down
         * or
         * Our x is less than the threshold
         *
         * The threshold basically tells how much to speed up
         *
         * Without this stop - x.current will mutiple expodentially
         */
        if (slowDown.current || Math.abs(x.current) < threshold) {
            return;
        }

        /**
         * This portion speeds up the spring until it reaches the `threshold`
         */
        x.current *= 0.66;

        if (x.current < 0) {
            x.current = Math.min(x.current, 0);
        } else {
            x.current = Math.max(x.current, 0);
        }

        //speedSpring sets the speed for the marquee items that gets passed to the item components
        speedSpring.set(speed + x.current);
    };

    useRafLoop(loop);

    return (
        <>
            <motion.div style={{ opacity }} ref={constraintsRef} />
            <motion.div
                className={className}
                ref={marqueeRef}
                style={{ skewX, rotate }}
                //                drag='x'
                //                dragPropagation={true}
                //                dragConstraints={{ left: 0, right: 0 }}
            >
                <div className='flex align-middle'>
                    <MarqueeItem speed={speedSpring}>{children}</MarqueeItem>
                    <MarqueeItem speed={speedSpring}>{children}</MarqueeItem>
                </div>
            </motion.div>
        </>
    );
};

import Chartist from 'chartist';

// export function tooltip(options) {
//
//     /**
//      * This Chartist tooltip plugin is a modified version of
//      * https://github.com/Globegitter/chartist-plugin-tooltip.
//      *
//      */
//     'use strict';
//
//     if (typeof window === 'undefined') {
//         return false;
//     }
//
//     var defaultOptions = {
//         valueTransform: Chartist.noop,
//         seriesName: true // Show name of series in tooltip.
//     };
//
//
//     options = Chartist.extend({}, defaultOptions, options);
//
//     return function tooltip(chart) {
//
//         var tooltipSelector = '.ct-point';
//         if (chart instanceof Chartist.Bar) {
//             tooltipSelector = '.ct-bar';
//         } else if (chart instanceof Chartist.Pie) {
//             tooltipSelector = '[class^=ct-slice]';
//         }
//
//         var $chart = $(chart.container),
//             $toolTip = $chart
//                 .append('<div class="ct-tooltip"></div>')
//                 .find('.ct-tooltip')
//                 .hide();
//
//         $chart.on('mouseenter', tooltipSelector, function() {
//             var $point = $(this),
//                 seriesName = $point.parent().attr('ct:series-name'),
//                 tooltipText = '';
//
//             if (options.seriesName && seriesName) {
//                 tooltipText += seriesName + '<br>';
//             }
//
//             if ($point.attr('ct:meta')) {
//                 tooltipText += $point.attr('ct:meta') + '<br>';
//             }
//
//             var value = $point.attr('ct:value') || '0';
//
//             tooltipText += options.valueTransform(value);
//
//             $toolTip.html(tooltipText).show();
//         });
//
//         $chart.on('mouseleave', tooltipSelector, function() {
//             $toolTip.hide();
//         });
//
//         $chart.on('mousemove', function(event) {
//             $toolTip.css({
//                 left: (event.offsetX || event.originalEvent.layerX) - $toolTip.width() / 2 - 10,
//                 top: (event.offsetY || event.originalEvent.layerY) - $toolTip.height() - 40
//             });
//         });
//
//     };
//
//     //
//     // return function ctPointLabels(chart) {
//     //     var defaultOptions = {
//     //         labelClass: 'ct-label',
//     //         labelOffset: {
//     //             x: 0,
//     //             y: -10
//     //         },
//     //         textAnchor: 'middle'
//     //     };
//     //
//     //     options = Chartist.extend({}, defaultOptions, options);
//     //
//     //     if(chart instanceof Chartist.Line) {
//     //         chart.on('draw', function(data) {
//     //             console.log(data);
//     //             if(data.type === 'point') {
//     //                 data.group.elem('text', {
//     //                     x: data.x + options.labelOffset.x,
//     //                     y: data.y + options.labelOffset.y,
//     //                     style: 'text-anchor: ' + options.textAnchor
//     //                 }, options.labelClass).text(data.value.y);
//     //             }
//     //         });
//     //     }
//     // }
// }
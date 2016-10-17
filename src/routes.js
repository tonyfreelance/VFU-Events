export default {

    gioiThieu: {
        initialRoute: true,

        title: 'Giới thiệu',
        component: require('./scenes/GioiThieu').default,

        children: {
            example: {
                // title: 'Child Example', // optional
                component: require('./scenes/NestedExample').default
            }
        }
    },

    lichTuan: {
        title: 'Lịch Tuần',
        component: require('./scenes/LichTuan').default
    },

    themes: {
        title: 'Change Theme',
        component: require('./scenes/Themes').default
    }
}

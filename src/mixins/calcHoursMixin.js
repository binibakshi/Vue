export default {
    data() {
        return {};
    },
    methods: {
        calcJobPercent(reformType, hours, ageHours, isMother) {
            if (hours == 0) {
                return 0;
            }
            if (reformType == 1 || reformType == 7) {
                return this.getOlamYashanJobPercent(ageHours, isMother, hours);
            } else if (reformType == 2) {
                return this.getOfekHasashJobPercent(ageHours, isMother, hours);
            } else if (reformType == 5) {
                return this.getOzLetmuraJobPercent(ageHours, isMother, hours);
            } else if (reformType == 8) {
                return this.getMinhalaJobPercent(ageHours, isMother, hours);
            }
        },
        getOlamYashanJobPercent(ageHours, isMother, frontalHours) {
            var jobPercent = 0,
                fullJobHours = 24;
            fullJobHours -= ageHours;
            jobPercent = (frontalHours / fullJobHours) * 100;
            if (isMother && jobPercent > 79) {
                jobPercent = jobPercent * 1.1;
            }
            return jobPercent;
        },
        getOfekHasashJobPercent(ageHours, isMother, allHours) {
            var jobPercent = 0,
                fullJobHours = 36;
            fullJobHours -= ageHours;
            if (isMother) {
                fullJobHours -= 2;
            }
            jobPercent = (allHours / fullJobHours) * 100;
            return jobPercent;
        },
        getOzLetmuraJobPercent(ageHours, isMother, allHours) {
            var jobPercent = 0,
                fullJobHours = 40;
            fullJobHours -= ageHours;
            jobPercent = (allHours / fullJobHours) * 100;
            if (isMother && jobPercent > 78.75) {
                jobPercent = jobPercent + 7;
            }
            return jobPercent;
        },
        getMinhalaJobPercent(ageHours, isMother, allHours) {
            var jobPercent = 0,
                fullJobHours = 20;
            jobPercent = (allHours / fullJobHours) * 100;
            return jobPercent;
        },
    },
};
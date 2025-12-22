import React, { useState } from "react";

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    
    const form = e.target;
    const data = {
      name: form.name.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value,
    };
    console.log("Contact Form Data:", data);

    form.reset();
    setLoading(false);
  };

  return (
    <section className="bg-base-200">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Contact <span className="text-primary">Us</span>
            </h2>
            <p className="mt-2 text-base-content/70 max-w-2xl">
              Need help finding blood donors or want to organize a donation camp? Send us a message anytime.
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-2xl border border-base-300 bg-base-100 p-5">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-base-200 flex items-center justify-center">
                  <img
                    src="https://img.icons8.com/color/96/phone.png"
                    alt="Phone"
                    className="w-7 h-7"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h3 className="font-bold">Call Us</h3>
                  <p className="text-sm text-base-content/70">
                    24/7 Emergency Support
                  </p>
                  <a className="link link-hover text-primary font-semibold" href="tel:+8801700000000">
                    +880 1700-000000
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-base-300 bg-base-100 p-5">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-base-200 flex items-center justify-center">
                  <img
                    src="https://img.icons8.com/color/96/new-post.png"
                    alt="Email"
                    className="w-7 h-7"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h3 className="font-bold">Email</h3>
                  <p className="text-sm text-base-content/70">
                    We reply within 24 hours
                  </p>
                  <a className="link link-hover text-primary font-semibold" href="mailto:support@bloodbridge.com">
                    support@bloodbridge.com
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-base-300 bg-base-100 p-5">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-base-200 flex items-center justify-center">
                  <img
                    src="https://img.icons8.com/color/96/marker.png"
                    alt="Location"
                    className="w-7 h-7"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h3 className="font-bold">Location</h3>
                  <p className="text-sm text-base-content/70">
                    Dhaka, Bangladesh
                  </p>
                  <p className="text-sm font-medium">Open: 9AM - 9PM</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-base-300 bg-base-100 p-5">
              <p className="text-sm text-base-content/70">
                <span className="font-semibold">Tip:</span> For emergencies, please call directly so we can respond faster.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 rounded-5xl border border-base-300 bg-base-100 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Your Name</span>
                  </label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="input input-bordered w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Subject</span>
                </label>
                <input
                  name="subject"
                  type="text"
                  placeholder="How can we help?"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Message</span>
                </label>
                <textarea
                  name="message"
                  placeholder="Write your message..."
                  className="textarea textarea-bordered w-full h-32"
                  required
                />
              </div>

              <button
                type="submit"
                className={`btn btn-primary rounded-full px-8 ${loading ? "btn-disabled" : ""}`}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

              <p className="text-xs text-base-content/60">
                By submitting, you agree to be contacted regarding your request.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

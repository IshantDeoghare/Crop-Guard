import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint

BASE_DIR    = os.path.join(os.path.dirname(__file__), "data", "PlantVillage")
PLANT_LIST  = ["Potato", "Tomato", "Pepper__bell"]
IMG_SIZE    = (224, 224)
BATCH_SIZE  = 32
EPOCHS      = 15
OUTPUT_DIR  = os.path.join(os.path.dirname(__file__), "models")

def build_simple_cnn(input_shape, num_classes):
    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=input_shape),
        tf.keras.layers.Conv2D(32, (3,3), activation="relu"),
        tf.keras.layers.MaxPooling2D(),
        tf.keras.layers.Conv2D(64, (3,3), activation="relu"),
        tf.keras.layers.MaxPooling2D(),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(128, activation="relu"),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(num_classes, activation="softmax")
    ])
    model.compile(
        optimizer=tf.keras.optimizers.Adam(1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )
    return model

# single‑plant trainer
def train_one_plant(plant_prefix):
    # find all sub‑folders in BASE_DIR that start with this prefix
    all_dirs = sorted(os.listdir(BASE_DIR))
    classes = [d for d in all_dirs if d.startswith(plant_prefix)]
    if not classes:
        print(f"⚠️  No folders for '{plant_prefix}' found under {BASE_DIR}, skipping.")
        return

    print(f"\n🔎 Training '{plant_prefix}' on these classes:\n   " + "\n   ".join(classes))

    datagen = ImageDataGenerator(
        rescale=1.0/255,
        rotation_range=20,
        width_shift_range=0.1,
        height_shift_range=0.1,
        horizontal_flip=True,
        validation_split=0.2
    )

    train_gen = datagen.flow_from_directory(
        directory=BASE_DIR,
        target_size=IMG_SIZE,
        classes=classes,
        class_mode="categorical",
        subset="training",
        batch_size=BATCH_SIZE,
        shuffle=True
    )

    val_gen = datagen.flow_from_directory(
        directory=BASE_DIR,
        target_size=IMG_SIZE,
        classes=classes,
        class_mode="categorical",
        subset="validation",
        batch_size=BATCH_SIZE,
        shuffle=False
    )

    if train_gen.samples == 0:
        print(f"⚠️  '{plant_prefix}' has 0 training images. Skipping.")
        return

    # build & checkpoint
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    ckpt_path = os.path.join(OUTPUT_DIR, f"{plant_prefix}_best.h5")
    checkpoint = ModelCheckpoint(ckpt_path, monitor="val_accuracy",
                                 save_best_only=True, verbose=1)

    model = build_simple_cnn(input_shape=IMG_SIZE + (3,),
                             num_classes=len(train_gen.class_indices))

    # train!
    model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=EPOCHS,
        callbacks=[checkpoint]
    )

    print(f"✅ Saved '{plant_prefix}' model to {ckpt_path}")

if __name__ == "__main__":
    print(f"📁 Using data folder: {BASE_DIR}")
    for plant in PLANT_LIST:
        train_one_plant(plant)
    print("\n🎉 All done. Check your ./models directory for the .h5 files.")
